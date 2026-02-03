export type LocationMapConfig = {
  lat: number;
  lng: number;
  zoom: number;
};

export const DEFAULT_LOCATION_MAP_ZOOM = 11;

export const LOCATION_MAPS: Record<string, LocationMapConfig> = {
  cincinnati: {
    lat: 39.1031,
    lng: -84.512,
    zoom: 12,
  },
  louisville: {
    lat: 38.2527,
    lng: -85.7585,
    zoom: 11,
  },
  lexington: {
    lat: 38.0406,
    lng: -84.5037,
    zoom: 12,
  },
  'northern-kentucky': {
    lat: 39.0346,
    lng: -84.507,
    zoom: 11,
  },
};

export function getLocationMapConfig(slug: string): LocationMapConfig | undefined {
  return LOCATION_MAPS[slug];
}
