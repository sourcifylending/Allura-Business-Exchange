const ADMIN_COOKIE_NAME = "allura_admin_session";
const ADMIN_EMAIL = "abelf305@gmail.com";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  expiresAt: number;
};

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

function getSessionSecret() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.ADMIN_SESSION_SECRET ?? "";
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function isAdminEmail(email: string) {
  return email.toLowerCase() === ADMIN_EMAIL;
}

export async function createAdminSession(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = JSON.stringify({ email, expiresAt } satisfies SessionPayload);
  const signature = await hmac(payload, getSessionSecret());
  return `${toBase64Url(new TextEncoder().encode(payload))}.${signature}`;
}

export async function verifyAdminSession(cookieValue: string | undefined) {
  if (!cookieValue) {
    return false;
  }

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature) {
    return false;
  }

  try {
    const payload = new TextDecoder().decode(fromBase64Url(encodedPayload));
    const parsed = JSON.parse(payload) as Partial<SessionPayload>;

    if (!parsed.email || !parsed.expiresAt || parsed.expiresAt * 1000 < Date.now()) {
      return false;
    }

    if (!isAdminEmail(parsed.email)) {
      return false;
    }

    const expectedSignature = await hmac(payload, getSessionSecret());
    return expectedSignature === signature;
  } catch {
    return false;
  }
}
