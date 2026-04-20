import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type {
  ApplicationStatus,
  BuyerApplicationRow,
  SellerApplicationRow,
} from "@/lib/supabase/database.types";

export type PortalRole = "buyer" | "seller";

type PortalRecord = BuyerApplicationRow | SellerApplicationRow;

type PortalMatch =
  | {
      kind: "buyer";
      record: BuyerApplicationRow;
    }
  | {
      kind: "seller";
      record: SellerApplicationRow;
    };

export type PortalAccessResult =
  | {
      kind: "unauthenticated";
    }
  | {
      kind: "none";
    }
  | {
      kind: "conflict";
      buyer?: BuyerApplicationRow;
      seller?: SellerApplicationRow;
    }
  | PortalMatch;

export type PortalActivationResult =
  | {
      ok: true;
      kind: PortalRole;
      record: PortalRecord;
    }
  | {
      ok: false;
      error: string;
    };

const activePortalStatuses: ApplicationStatus[] = ["invited", "activated"];

function roleForTable(table: "buyer_applications" | "seller_applications"): PortalRole {
  return table === "buyer_applications" ? "buyer" : "seller";
}

function tableForRole(role: PortalRole) {
  return role === "buyer" ? "buyer_applications" : "seller_applications";
}

function isPortalStatus(status: ApplicationStatus) {
  return activePortalStatuses.includes(status);
}

function dedupeById<T extends { id: string }>(records: T[]) {
  return [...new Map(records.map((record) => [record.id, record])).values()];
}

async function getSignedInUser() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch {
    return null;
  }
}

async function loadMatchesForTable(table: "buyer_applications" | "seller_applications", userId: string, email?: string | null) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return [] as PortalRecord[];
  }

  const records: PortalRecord[] = [];

  const linkedResult = await adminClient
    .from(table)
    .select("*")
    .eq("linked_user_id", userId)
    .in("status", activePortalStatuses);

  if (!linkedResult.error && linkedResult.data) {
    records.push(...(linkedResult.data as PortalRecord[]));
  }

  if (email) {
    const emailResult = await adminClient.from(table).select("*").eq("email", email).in("status", activePortalStatuses);

    if (!emailResult.error && emailResult.data) {
      records.push(...(emailResult.data as PortalRecord[]));
    }
  }

  return dedupeById(records);
}

export async function resolvePortalAccessForSession(): Promise<PortalAccessResult> {
  const user = await getSignedInUser();

  if (!user) {
    return { kind: "unauthenticated" };
  }

  const [buyer, seller] = await Promise.all([
    loadMatchesForTable("buyer_applications", user.id, user.email),
    loadMatchesForTable("seller_applications", user.id, user.email),
  ]);

  if (buyer.length > 1 || seller.length > 1) {
    return {
      kind: "conflict",
      buyer: buyer[0] as BuyerApplicationRow | undefined,
      seller: seller[0] as SellerApplicationRow | undefined,
    };
  }

  const buyerMatch = buyer[0];
  const sellerMatch = seller[0];

  if (buyerMatch && sellerMatch) {
    return {
      kind: "conflict",
      buyer: buyerMatch as BuyerApplicationRow,
      seller: sellerMatch as SellerApplicationRow,
    };
  }

  if (buyerMatch) {
    return {
      kind: "buyer",
      record: buyerMatch as BuyerApplicationRow,
    };
  }

  if (sellerMatch) {
    return {
      kind: "seller",
      record: sellerMatch as SellerApplicationRow,
    };
  }

  return { kind: "none" };
}

export async function activateInvitedPortalAccess(role: PortalRole, authUserId: string, authUserEmail?: string | null) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return {
      ok: false,
      error: "Portal activation is temporarily unavailable.",
    } as const;
  }

  const table = tableForRole(role);
  const oppositeTable = role === "buyer" ? "seller_applications" : "buyer_applications";
  const targetMatches = await loadMatchesForTable(table, authUserId, authUserEmail);

  if (targetMatches.length !== 1) {
    return {
      ok: false,
      error: "No invited application was found for this account.",
    } as const;
  }

  const targetMatch = targetMatches[0];

  if (!targetMatch) {
    return {
      ok: false,
      error: "No invited application was found for this account.",
    } as const;
  }

  if (!isPortalStatus(targetMatch.status)) {
    return {
      ok: false,
      error: "This application is not ready for portal activation.",
    } as const;
  }

  const conflictingMatches = await loadMatchesForTable(oppositeTable, authUserId, authUserEmail);

  if (conflictingMatches.length > 0) {
    return {
      ok: false,
      error: "Conflicting buyer and seller portal access was detected.",
    } as const;
  }

  const linkedUserId = targetMatch.linked_user_id ?? authUserId;
  const invitedAt = targetMatch.invited_at ?? new Date().toISOString();

  const { data, error } = await adminClient
    .from(table)
    .update({
      status: "activated",
      linked_user_id: linkedUserId,
      invited_at: invitedAt,
    } as never)
    .eq("id", targetMatch.id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      error: "Unable to activate portal access.",
    } as const;
  }

  return {
    ok: true,
    kind: roleForTable(table),
    record: data as PortalRecord,
  } as const;
}

export async function requirePortalRole(role: PortalRole) {
  const access = await resolvePortalAccessForSession();

  if (access.kind === "unauthenticated") {
    redirect("/");
  }

  if (access.kind === "conflict") {
    redirect("/portal?error=Conflicting%20buyer%20and%20seller%20portal%20access%20was%20detected.");
  }

  if (access.kind !== role) {
    redirect(
      `/portal?error=${encodeURIComponent(
        role === "buyer" ? "This portal is for buyer accounts only." : "This portal is for seller accounts only.",
      )}`,
    );
  }

  return access.record;
}

export async function requireBuyerPortalAccess() {
  const record = await requirePortalRole("buyer");

  if ("buyer_type" in record) {
    return record;
  }

  redirect("/portal?error=This%20portal%20is%20for%20buyer%20accounts%20only.");
}

export async function requireActivatedBuyerPortalAccess() {
  const record = await requireBuyerPortalAccess();

  if (record.status !== "activated") {
    redirect("/portal/buyer?error=Buyer%20opportunities%20unlock%20after%20activation.");
  }

  return record;
}

export async function requireSellerPortalAccess() {
  const record = await requirePortalRole("seller");

  if ("business_name" in record) {
    return record;
  }

  redirect("/portal?error=This%20portal%20is%20for%20seller%20accounts%20only.");
}

export async function requireActivatedSellerPortalAccess() {
  const record = await requireSellerPortalAccess();

  if (record.status !== "activated") {
    redirect("/portal/seller?error=Seller%20opportunities%20unlock%20after%20activation.");
  }

  return record;
}
