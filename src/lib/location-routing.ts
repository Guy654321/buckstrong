import type { Location } from './locations';

function normalizeSlug(value: string | undefined | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildLocationCitySegment(locationSlug: string | undefined | null): string {
  const normalized = normalizeSlug(locationSlug);
  return normalized ? `${normalized}-oh` : '';
}

export function buildLocalizedServicePath(
  locationSlug: string | undefined | null,
  serviceSlug: string | undefined | null,
): string {
  const citySegment = buildLocationCitySegment(locationSlug);
  const normalizedServiceSlug = normalizeSlug(serviceSlug);

  if (!citySegment) {
    return normalizedServiceSlug ? `/${normalizedServiceSlug}` : '/';
  }

  return normalizedServiceSlug ? `/${citySegment}/${normalizedServiceSlug}` : `/${citySegment}`;
}

export function getLocationServiceCityName(location?: Location): string | undefined {
  if (!location) {
    return undefined;
  }

  return location.isHub ? location.address?.addressLocality?.trim() || location.name : location.name;
}

