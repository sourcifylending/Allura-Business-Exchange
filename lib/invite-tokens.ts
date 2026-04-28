import crypto from "crypto";

type InviteTokenPayload = Readonly<{
  buyerId: string;
  exp: number;
}>;

function getInviteTokenSecret() {
  const secret =
    process.env.INVITE_TOKEN_SECRET ||
    process.env.RESEND_API_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!secret) {
    throw new Error("Invite token secret is not configured.");
  }

  return secret;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", getInviteTokenSecret()).update(payload).digest("base64url");
}

export function createBuyerInviteToken(buyerId: string, expiresInDays = 7) {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const payload = base64UrlEncode(JSON.stringify({ buyerId, exp } satisfies InviteTokenPayload));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function verifyBuyerInviteToken(token: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return { ok: false, error: "Invalid invite link." } as const;
  }

  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return { ok: false, error: "Invalid invite link." } as const;
  }

  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as Partial<InviteTokenPayload>;

    if (!decoded.buyerId || !decoded.exp || typeof decoded.buyerId !== "string" || typeof decoded.exp !== "number") {
      return { ok: false, error: "Invalid invite link." } as const;
    }

    if (Date.now() > decoded.exp) {
      return { ok: false, error: "This invite link has expired." } as const;
    }

    return { ok: true, buyerId: decoded.buyerId } as const;
  } catch {
    return { ok: false, error: "Invalid invite link." } as const;
  }
}
