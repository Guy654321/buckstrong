const FALLBACK_ORIGIN = import.meta.env?.PUBLIC_SITE_URL?.trim() || 'https://derbystronggaragedoors.com';

function normalizeSiteOrigin(candidate?: string | null, fallback = FALLBACK_ORIGIN): string {
  if (!candidate) {
    return fallback;
  }

  const trimmed = candidate.trim().replace(/\/+$/, '');
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.toString();
  } catch {
    return fallback;
  }
}

export function getSiteOrigin(): string {
  const fromEnv = import.meta.env?.PUBLIC_SITE_URL;
  return normalizeSiteOrigin(fromEnv);
}

export function buildAbsoluteUrl(pathname = '/', origin = getSiteOrigin()): string {
  const targetPath = pathname || '/';
  const absolute = new URL(targetPath, origin);

  if (absolute.pathname !== '/') {
    absolute.pathname = absolute.pathname.replace(/\/+$/, '').replace(/\/+/g, '/');
  }

  return absolute.toString();
}
