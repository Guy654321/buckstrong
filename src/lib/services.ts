import { getCollection, type CollectionEntry } from 'astro:content';

export type ServiceEntry = CollectionEntry<'services'>;

export type Service = {
  name: string;
  slug: string;
  short: string;
  description?: string;
  featured: boolean;
  order: number;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: string;
};

export type ServiceSummary = Service;

function normalizeService(entry: ServiceEntry): Service {
  const {
    data: { name, slug, short, description, featured, order, ctaLabel, ctaHref, icon },
  } = entry;

  return {
    name,
    slug,
    short,
    description,
    featured: featured ?? false,
    order: typeof order === 'number' ? order : Number.MAX_SAFE_INTEGER,
    ctaLabel,
    ctaHref,
    icon,
  };
}

function sortServices(a: Service, b: Service): number {
  if (a.order !== b.order) {
    return a.order - b.order;
  }

  return a.name.localeCompare(b.name);
}

export async function getServices(): Promise<Service[]> {
  const entries = await getCollection('services');
  return entries.map(normalizeService).sort(sortServices);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((service) => service.slug === slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((service) => service.slug);
}
