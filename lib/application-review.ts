import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/app-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  ApplicationStatus,
  BuyerApplicationRow,
  SellerApplicationRow,
} from "@/lib/supabase/database.types";

type ApplicationTable = "buyer_applications" | "seller_applications";
type ApplicationRecord = BuyerApplicationRow | SellerApplicationRow;

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  invited: "Invited",
  activated: "Activated",
};

export const applicationStatusOrder: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "approved",
  "invited",
  "activated",
  "rejected",
];

type ReviewFormValues = {
  id: string;
  status: ApplicationStatus;
  admin_notes: string;
};

function hasSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return Boolean(
    url &&
      key &&
      (() => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      })(),
  );
}

function hasServiceRoleEnv() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function readId(formData: FormData) {
  const value = formData.get("id");
  return typeof value === "string" ? value.trim() : "";
}

function readReviewFormData(formData: FormData) {
  const id = readId(formData);
  const status = formData.get("status");
  const adminNotes = formData.get("admin_notes");
  const validStatuses = applicationStatusOrder;

  if (
    !id ||
    typeof status !== "string" ||
    !validStatuses.includes(status as ApplicationStatus) ||
    typeof adminNotes !== "string"
  ) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      id,
      status: status as ApplicationStatus,
      admin_notes: adminNotes.trim(),
    } satisfies ReviewFormValues,
  } as const;
}

async function getAdminActorId() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.id) {
    return null;
  }

  return data.user.id;
}

function routeFor(table: ApplicationTable) {
  return table === "buyer_applications" ? "/admin/applications/buyers" : "/admin/applications/sellers";
}

function inviteMetadata(table: ApplicationTable, record: ApplicationRecord) {
  return {
    application_table: table,
    application_id: record.id,
    applicant_name: record.applicant_name,
  };
}

function inviteRedirectTo(table: ApplicationTable) {
  const appUrl = getAppUrl();

  if (!appUrl) {
    return null;
  }

  const role = table === "buyer_applications" ? "buyer" : "seller";
  const url = new URL("/auth/callback", appUrl);
  url.searchParams.set("type", role);
  return url.toString();
}

function readAdminNotes(formData: FormData) {
  const value = formData.get("admin_notes");

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

async function getApplicationRecords(table: ApplicationTable) {
  if (!hasSupabaseEnv()) {
    return [] as ApplicationRecord[];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });

    if (error || !data) {
      return [] as ApplicationRecord[];
    }

    return data as ApplicationRecord[];
  } catch {
    return [] as ApplicationRecord[];
  }
}

async function getApplicationRecord(table: ApplicationTable, id: string) {
  if (!hasSupabaseEnv() || !id) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as ApplicationRecord;
  } catch {
    return null;
  }
}

async function updateReviewState(
  table: ApplicationTable,
  id: string,
  status: ApplicationStatus,
  adminNotes: string,
  routeBase = routeFor(table),
) {
  const actorId = await getAdminActorId();

  if (!actorId) {
    redirect(`${routeBase}/${id}?error=Unable%20to%20determine%20the%20current%20admin.`);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from(table)
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: actorId,
      } as never)
      .eq("id", id);

    if (error) {
      redirect(`${routeBase}/${id}?error=Unable%20to%20save%20the%20review.`);
    }

    revalidatePath(routeBase);
    revalidatePath(`${routeBase}/${id}`);
    redirect(`${routeBase}/${id}?saved=updated`);
  } catch {
    redirect(`${routeBase}/${id}?error=Unable%20to%20save%20the%20review.`);
  }
}

async function transitionReviewState(
  table: ApplicationTable,
  id: string,
  status: ApplicationStatus,
  adminNotes: string | null,
  routeBase = routeFor(table),
) {
  const actorId = await getAdminActorId();

  if (!actorId) {
    redirect(`${routeBase}/${id}?error=Unable%20to%20determine%20the%20current%20admin.`);
  }

  try {
    const supabase = createClient();
    const { data: currentData, error: currentError } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const current = currentData as ApplicationRecord | null;

    if (currentError || !current) {
      redirect(`${routeBase}/${id}?error=Application%20record%20not%20found.`);
    }

    const { error } = await supabase
      .from(table)
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: actorId,
        admin_notes: adminNotes ?? current.admin_notes,
      } as never)
      .eq("id", id);

    if (error) {
      redirect(`${routeBase}/${id}?error=Unable%20to%20update%20the%20application.`);
    }

    revalidatePath(routeBase);
    revalidatePath(`${routeBase}/${id}`);
    redirect(`${routeBase}/${id}?saved=${encodeURIComponent(status)}`);
  } catch {
    redirect(`${routeBase}/${id}?error=Unable%20to%20update%20the%20application.`);
  }
}

async function inviteApplication(table: ApplicationTable, id: string, routeBase = routeFor(table)) {
  const actorId = await getAdminActorId();

  if (!actorId) {
    redirect(`${routeBase}/${id}?error=Unable%20to%20determine%20the%20current%20admin.`);
  }

  const supabase = createClient();
  const { data: recordData, error: recordError } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  const record = recordData as ApplicationRecord | null;

  if (recordError || !record) {
    redirect(`${routeBase}/${id}?error=Application%20record%20not%20found.`);
  }

  if (record.status !== "approved") {
    redirect(`${routeBase}/${id}?error=Only%20approved%20applications%20can%20be%20invited.`);
  }

  if (!hasServiceRoleEnv()) {
    redirect(`${routeBase}/${id}?error=Invite%20service%20credentials%20are%20not%20configured.`);
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    redirect(`${routeBase}/${id}?error=Invite%20service%20credentials%20are%20not%20configured.`);
  }

  const redirectTo = inviteRedirectTo(table);

  if (!redirectTo) {
    redirect(`${routeBase}/${id}?error=Portal%20redirect%20URL%20is%20not%20configured.`);
  }

  const inviteResponse = await adminClient.auth.admin.inviteUserByEmail(record.email, {
    data: inviteMetadata(table, record),
    redirectTo,
  });

  if (inviteResponse.error) {
    redirect(`${routeBase}/${id}?error=Unable%20to%20send%20the%20invite.`);
  }

  const invitedAt = new Date().toISOString();

  const { error } = await supabase
    .from(table)
    .update({
      status: "invited",
      invited_at: invitedAt,
      invited_by: actorId,
      linked_user_id: inviteResponse.data.user?.id ?? null,
      reviewed_at: record.reviewed_at ?? invitedAt,
      reviewed_by: record.reviewed_by ?? actorId,
    } as never)
    .eq("id", id);

  if (error) {
    redirect(`${routeBase}/${id}?error=Invite%20sent%2C%20but%20the%20record%20did%20not%20update.`);
  }

  revalidatePath(routeBase);
  revalidatePath(`${routeBase}/${id}`);
  redirect(`${routeBase}/${id}?invited=1`);
}

export async function getBuyerApplicationRecords() {
  return getApplicationRecords("buyer_applications") as Promise<BuyerApplicationRow[]>;
}

export async function getSellerApplicationRecords() {
  return getApplicationRecords("seller_applications") as Promise<SellerApplicationRow[]>;
}

export async function getBuyerApplicationRecord(id: string) {
  return getApplicationRecord("buyer_applications", id) as Promise<BuyerApplicationRow | null>;
}

export async function getSellerApplicationRecord(id: string) {
  return getApplicationRecord("seller_applications", id) as Promise<SellerApplicationRow | null>;
}

export async function saveBuyerApplicationReview(formData: FormData) {
  "use server";

  const id = readId(formData);
  const parsed = readReviewFormData(formData);

  if ("error" in parsed) {
    redirect(
      id
        ? `/admin/applications/buyers/${id}?error=Please%20complete%20all%20required%20fields.`
        : "/admin/applications/buyers?error=Please%20complete%20all%20required%20fields.",
    );
  }

  await updateReviewState("buyer_applications", parsed.data.id, parsed.data.status, parsed.data.admin_notes);
}

export async function markBuyerApplicationUnderReview(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/buyers?error=Missing%20record%20id.");
  }

  await transitionReviewState("buyer_applications", id, "under_review", readAdminNotes(formData));
}

export async function approveBuyerApplication(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/buyers?error=Missing%20record%20id.");
  }

  await transitionReviewState("buyer_applications", id, "approved", readAdminNotes(formData));
}

export async function rejectBuyerApplication(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/buyers?error=Missing%20record%20id.");
  }

  await transitionReviewState("buyer_applications", id, "rejected", readAdminNotes(formData));
}

export async function inviteBuyerApplication(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/buyers?error=Missing%20record%20id.");
  }

  await inviteApplication("buyer_applications", id);
}

export async function saveSellerApplicationReview(formData: FormData) {
  "use server";

  const id = readId(formData);
  const parsed = readReviewFormData(formData);

  if ("error" in parsed) {
    redirect(
      id
        ? `/admin/applications/sellers/${id}?error=Please%20complete%20all%20required%20fields.`
        : "/admin/applications/sellers?error=Please%20complete%20all%20required%20fields.",
    );
  }

  await updateReviewState("seller_applications", parsed.data.id, parsed.data.status, parsed.data.admin_notes);
}

export async function markSellerApplicationUnderReview(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/sellers?error=Missing%20record%20id.");
  }

  await transitionReviewState("seller_applications", id, "under_review", readAdminNotes(formData));
}

export async function approveSellerApplication(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/sellers?error=Missing%20record%20id.");
  }

  await transitionReviewState("seller_applications", id, "approved", readAdminNotes(formData));
}

export async function rejectSellerApplication(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/sellers?error=Missing%20record%20id.");
  }

  await transitionReviewState("seller_applications", id, "rejected", readAdminNotes(formData));
}

export async function inviteSellerApplication(formData: FormData) {
  "use server";

  const id = readId(formData);

  if (!id) {
    redirect("/admin/applications/sellers?error=Missing%20record%20id.");
  }

  await inviteApplication("seller_applications", id);
}

export function filterApplications<T extends { status: ApplicationStatus }>(
  records: T[],
  status: ApplicationStatus | "all",
) {
  if (status === "all") {
    return records;
  }

  return records.filter((record) => record.status === status);
}

export function countApplicationsByStatus<T extends { status: ApplicationStatus }>(records: T[]) {
  return applicationStatusOrder.reduce(
    (accumulator, status) => {
      accumulator[status] = records.filter((record) => record.status === status).length;
      return accumulator;
    },
    {} as Record<ApplicationStatus, number>,
  );
}

export function formatApplicationDate(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function summarizeList(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "None";
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "None";
}
