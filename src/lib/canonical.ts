import { buildLocalizedServicePath } from './location-routing';

export const LEGACY_MARKET_REDIRECTS: Record<string, string> = {};

const CANONICAL_HUB_SLUGS = new Set(['cincinnati']);

function normalizeSlug(slug: string | undefined | null): string {
  return typeof slug === 'string' ? slug.trim() : '';
}

export function resolveCanonicalLocationSlug(slug: string | undefined | null): string {
  const normalized = normalizeSlug(slug);
  if (CANONICAL_HUB_SLUGS.has(normalized)) {
    return normalized;
  }

  return LEGACY_MARKET_REDIRECTS[normalized] ?? normalized;
}

export function buildLocationCanonicalPath(slug: string | undefined | null): string {
  const canonicalSlug = resolveCanonicalLocationSlug(slug);
  return canonicalSlug ? `/locations/${canonicalSlug}` : '/locations';
}

export function buildLocationServiceCanonicalPath(
  locationSlug: string | undefined | null,
  serviceSlug: string | undefined | null,
): string {
  const canonicalLocationSlug = resolveCanonicalLocationSlug(locationSlug);
  return buildLocalizedServicePath(canonicalLocationSlug, serviceSlug);
}
