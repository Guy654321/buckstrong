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
};

export function getLocationMapConfig(slug: string): LocationMapConfig | undefined {
  return LOCATION_MAPS[slug];
}
