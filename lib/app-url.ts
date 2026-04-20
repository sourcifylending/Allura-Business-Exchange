const DEFAULT_APP_URL = "https://app.allurabusinessexchange.com";
const DEFAULT_ADMIN_URL = "https://admin.allurabusinessexchange.com";
const DEFAULT_SITE_URL = "https://allurabusinessexchange.com";

function parseOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

export function getAppUrl() {
  const configuredUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

  if (configuredUrl) {
    return parseOrigin(configuredUrl);
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return DEFAULT_APP_URL;
}

export function getAdminUrl() {
  const configuredUrl = process.env.ADMIN_URL ?? "";

  if (configuredUrl) {
    return parseOrigin(configuredUrl);
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3001";
  }

  return DEFAULT_ADMIN_URL;
}

export function getSiteUrl() {
  const configuredUrl = process.env.PUBLIC_SITE_URL ?? "";

  if (configuredUrl) {
    return parseOrigin(configuredUrl);
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return DEFAULT_SITE_URL;
}

export function getAppHostname() {
  const configuredUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL;
  const origin = parseOrigin(configuredUrl) || DEFAULT_APP_URL;

  return new URL(origin).hostname;
}

export function getAdminHostname() {
  const configuredUrl = process.env.ADMIN_URL ?? DEFAULT_ADMIN_URL;
  const origin = parseOrigin(configuredUrl) || DEFAULT_ADMIN_URL;

  return new URL(origin).hostname;
}

export function getSiteHostname() {
  const configuredUrl = process.env.PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const origin = parseOrigin(configuredUrl) || DEFAULT_SITE_URL;

  return new URL(origin).hostname;
}

export function isAppHostname(hostname: string) {
  return hostname.trim().toLowerCase() === getAppHostname();
}

export function isAdminHostname(hostname: string) {
  return hostname.trim().toLowerCase() === getAdminHostname();
}

export function isSiteHostname(hostname: string) {
  return hostname.trim().toLowerCase() === getSiteHostname();
}
