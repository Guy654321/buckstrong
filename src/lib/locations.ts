import { getCollection, type CollectionEntry } from 'astro:content';

export type LocationEntry = CollectionEntry<'locations'>;

export type LocationAddress = {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
};

export type Location = {
  name: string;
  slug: string;
  state: string;
  phone: string;
  market: string;
  parentHub?: string;
  lat: number;
  lng: number;
  showAddress: boolean;
  serviceAreaBusiness: boolean;
  address?: LocationAddress;
  gbp?: string;
  heroImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  zips?: string[];
  surroundingAreas: string[];
  isHub: boolean;
};

export type LocationGroup = {
  market: string;
  hub?: Location;
  areas: Location[];
};

export const PRIMARY_MARKET_PRIORITY = [
  'Louisville Metro',
  'Lexington Metro',
  'Northern Kentucky',
] as const;

function resolveMarketPriority(market: string): number {
  const index = PRIMARY_MARKET_PRIORITY.indexOf(market as (typeof PRIMARY_MARKET_PRIORITY)[number]);
  return index === -1 ? PRIMARY_MARKET_PRIORITY.length : index;
}

export function mapLocationEntry(entry: LocationEntry): Location {
  const {
    data: {
      name,
      slug,
      state,
      phone,
      market,
      parentHub,
      showAddress,
      serviceAreaBusiness,
      address,
      geo,
      gbpUrl,
      heroImage,
      metaTitle,
      metaDescription,
      zips,
      surroundingAreas,
    },
  } = entry;

  return {
    name,
    slug: slug?.trim() || entry.id,
    state,
    phone,
    market,
    parentHub: parentHub?.trim() || undefined,
    showAddress,
    serviceAreaBusiness: serviceAreaBusiness || !showAddress,
    address: address
      ? {
          streetAddress: address.streetAddress?.trim(),
          addressLocality: address.addressLocality?.trim(),
          addressRegion: address.addressRegion?.trim(),
          postalCode: address.postalCode?.trim(),
          addressCountry: address.addressCountry?.trim(),
        }
      : undefined,
    lat: geo.lat,
    lng: geo.lng,
    gbp: gbpUrl,
    heroImage,
    metaTitle,
    metaDescription,
    zips,
    surroundingAreas: surroundingAreas ?? [],
    isHub: !parentHub || parentHub === slug,
  };
}

export async function getLocations(): Promise<Location[]> {
  const entries = await getCollection('locations');
  return entries
    .map(mapLocationEntry)
    .sort((a, b) => {
      const marketCompare = a.market.localeCompare(b.market);
      if (marketCompare !== 0) {
        return marketCompare;
      }

      if (a.isHub !== b.isHub) {
        return a.isHub ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
}

export async function getLocationHubs(): Promise<Location[]> {
  const locations = await getLocations();
  const hubs = locations.filter((location) => location.isHub);

  return hubs.sort((a, b) => {
    const marketPriorityDifference =
      resolveMarketPriority(a.market) - resolveMarketPriority(b.market);

    if (marketPriorityDifference !== 0) {
      return marketPriorityDifference;
    }

    return a.name.localeCompare(b.name);
  });
}

export async function getLocationBySlug(slug: string): Promise<Location | undefined> {
  const locations = await getLocations();
  return locations.find((location) => location.slug === slug);
}

export async function loadLocationBySlug(slug: string): Promise<Location | undefined> {
  if (!slug) {
    return undefined;
  }

  const [entry] = await getCollection(
    'locations',
    (candidate) => candidate.data.slug?.trim() === slug || candidate.id === slug,
  );

  return entry ? mapLocationEntry(entry) : undefined;
}

export async function getHubForLocation(location: Location): Promise<Location | undefined> {
  if (location.isHub) {
    return location;
  }

  const parentSlug = location.parentHub?.trim();
  if (parentSlug) {
    const parentHub = await loadLocationBySlug(parentSlug);
    if (parentHub) {
      return parentHub;
    }
  }

  const locations = await getLocations();
  return locations.find((candidate) => candidate.market === location.market && candidate.isHub);
}

export async function getLocationSlugs(): Promise<string[]> {
  const locations = await getLocations();
  return locations.map((location) => location.slug);
}

export async function getLocationsByMarket(): Promise<LocationGroup[]> {
  const locations = await getLocations();
  const groups = new Map<string, LocationGroup>();

  for (const location of locations) {
    const existing = groups.get(location.market) ?? {
      market: location.market,
      areas: [],
    };

    if (location.isHub) {
      existing.hub = location;
    } else {
      existing.areas = [...existing.areas, location];
    }

    groups.set(location.market, existing);
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    areas: group.areas.sort((a, b) => a.name.localeCompare(b.name)),
  })).sort((a, b) => a.market.localeCompare(b.market));
}
