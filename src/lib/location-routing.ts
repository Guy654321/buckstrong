import type { Location } from './locations';

function normalizeSlug(value: string | undefined | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildLocationCitySegment(locationSlug: string | undefined | null): string {
  const normalized = normalizeSlug(locationSlug);
  const citySlug = normalized.replace(/^(cincinnati|cleveland)-/, '');
  return citySlug ? `${citySlug}-oh` : '';
}

export function buildLocationCitySlug(locationSlug: string | undefined | null): string {
  return normalizeSlug(locationSlug).replace(/^(cincinnati|cleveland)-/, '');
}

export function buildLocalizedServicePath(
  locationSlug: string | undefined | null,
  serviceSlug: string | undefined | null,
): string {
  const normalizedLocation = normalizeSlug(locationSlug);
  // Cleveland suburb pages connect to the market's service hubs. Generating a
  // second copy of every service for each suburb would create doorway pages.
  const serviceLocation = normalizedLocation.startsWith('cleveland-') ? 'cleveland' : normalizedLocation;
  const citySegment = buildLocationCitySegment(serviceLocation);
  const normalizedServiceSlug = normalizeSlug(serviceSlug);

  if (serviceLocation === 'cleveland' && normalizedServiceSlug.startsWith('garage-door-') && !['garage-door-repair', 'garage-door-installation'].includes(normalizedServiceSlug)) {
    return '/cleveland-oh/garage-door-repair';
  }

  if (!citySegment) {
    return normalizedServiceSlug ? `/${normalizedServiceSlug}` : '/';
  }

  return normalizedServiceSlug ? `/${citySegment}/${normalizedServiceSlug}` : `/${citySegment}`;
}

export function getLocationServiceCityName(location?: Location): string | undefined {
  if (!location) {
    return undefined;
  }

  return location.name;
}
