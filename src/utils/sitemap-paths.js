/**
 * Normalize an array into a safe list of path segments.
 * @param {Array<{ slug?: string | null | undefined }>} entries
 * @param {(slug: string) => string} formatter
 * @returns {string[]}
 */
function mapSlugEntries(entries, formatter) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map((entry) => (typeof entry?.slug === 'string' ? entry.slug.trim() : ''))
    .filter((slug) => slug.length > 0)
    .map(formatter);
}

/**
 * Build hub + service URL combinations for sitemap inclusion.
 * @param {Array<{ slug?: string | null | undefined }>} hubs
 * @param {Array<{ slug?: string | null | undefined }>} services
 * @returns {string[]}
 */
export function buildHubServicePaths(hubs, services) {
  if (!Array.isArray(hubs) || !Array.isArray(services)) {
    return [];
  }

  const validHubs = hubs.filter((hub) => typeof hub?.slug === 'string' && hub.slug.trim().length > 0);
  const validServices = services.filter(
    (service) => typeof service?.slug === 'string' && service.slug.trim().length > 0,
  );

  return validHubs.flatMap((hub) =>
    validServices.map((service) => `/locations/${hub.slug.trim()}/services/${service.slug.trim()}`),
  );
}

/**
 * Assemble all sitemap candidate paths based on site data.
 * @param {{
 *   staticRoutes?: string[];
 *   dynamicServiceSlugs?: string[];
 *   services?: Array<{ slug?: string | null | undefined }>;
 *   locations?: Array<{ slug?: string | null | undefined; isHub?: boolean }>;
 *   hubs?: Array<{ slug?: string | null | undefined }>;
 *   blogPosts?: Array<{ slug?: string | null | undefined }>;
 * }} params
 * @returns {string[]}
 */
export function buildSitemapPathCandidates({
  staticRoutes = [],
  dynamicServiceSlugs = [],
  services = [],
  locations = [],
  hubs,
  blogPosts = [],
} = {}) {
  const safeStaticRoutes = Array.isArray(staticRoutes) ? staticRoutes : [];
  const servicePaths = mapSlugEntries(services, (slug) => `/services/${slug}`);
  const dynamicServicePaths = Array.isArray(dynamicServiceSlugs)
    ? dynamicServiceSlugs
        .map((slug) => (typeof slug === 'string' ? slug.trim() : ''))
        .filter((slug) => slug.length > 0)
        .map((slug) => `/services/${slug}`)
    : [];
  const locationPaths = mapSlugEntries(locations, (slug) => `/locations/${slug}`);
  const blogPaths = mapSlugEntries(blogPosts, (slug) => `/blog/${slug}`);

  const hubEntries = Array.isArray(hubs) && hubs?.length ? hubs : locations.filter((loc) => loc?.isHub);
  const hubServicePaths = buildHubServicePaths(hubEntries, services);

  return [
    ...safeStaticRoutes,
    ...servicePaths,
    ...dynamicServicePaths,
    ...locationPaths,
    ...hubServicePaths,
    ...blogPaths,
  ];
}
