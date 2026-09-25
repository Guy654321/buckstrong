import type { Location } from './locations';

const CLEVELAND_SUBURB_SERVICES = new Set([
  'garage-door-repair',
  'garage-door-installation',
  'opener-repair',
  'commercial-jobs',
  'garage-door-spring-replacement',
  'garage-door-opener-repair',
  'garage-door-cable-repair',
  'garage-door-track-alignment',
  'garage-door-panel-replacement',
  'garage-door-rollers-hinges',
  'garage-door-sensor-alignment',
  'garage-door-weatherstripping',
  'garage-door-maintenance',
  'garage-door-balance-adjustment',
  'garage-door-opener-belt-drive-repair',
  'garage-door-opener-chain-drive-repair',
  'garage-door-opener-jackshaft-opener-repair',
  'garage-door-opener-screw-drive-opener-repair',
  'garage-door-steel-garage-doors',
  'garage-door-wood-garage-doors',
  'garage-door-aluminum-garage-doors',
  'garage-door-carriage-house-garage-doors',
  'garage-door-commercial-warehouse-distribution-door-service',
  'garage-door-commercial-dock-industrial-door-equipment-service',
  'garage-door-commercial-retail-municipal-garage-door-service',
]);

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
  const normalizedServiceSlug = normalizeSlug(serviceSlug);
  // Core services and all four detail groups have Cleveland suburb pages.
  const serviceLocation = normalizedLocation.startsWith('cleveland-') && !CLEVELAND_SUBURB_SERVICES.has(normalizedServiceSlug)
    ? 'cleveland'
    : normalizedLocation;
  const citySegment = buildLocationCitySegment(serviceLocation);

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
