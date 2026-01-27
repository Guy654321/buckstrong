import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getLocations } from '../lib/locations';
import { getServices } from '../lib/services';
import {
  getChangeFreq,
  getLastModified,
  getPriority,
  shouldExcludePage
} from '../utils/sitemap-utils.js';
import { buildSitemapPathCandidates } from '../utils/sitemap-paths.js';
import { getSiteOrigin } from '../utils/site-origin';

const SITE_ORIGIN = getSiteOrigin();
const STATIC_ROUTES = [
  '/',
  '/blog',
  '/contact',
  '/faq',
  '/locations',
  '/safety',
  '/services',
  '/services/garage-door-repair',
  '/services/garage-door-installation',
  '/services/opener-repair',
  '/services/commercial-jobs'
];

const DYNAMIC_SERVICE_SLUGS: string[] = [];

function normalizePathForSitemap(pathname: string) {
  if (!pathname) {
    return '/';
  }

  let normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  normalized = normalized.replace(/\/+/g, '/');

  if (normalized === '/') {
    return '/';
  }

  const hasExtension = /\.[a-z0-9]+$/i.test(normalized);

  if (!hasExtension) {
    normalized = normalized.replace(/\/+$/, '');
  }

  return normalized || '/';
}
function createEntry(pathname: string) {
  const normalizedPath = normalizePathForSitemap(pathname);

  if (shouldExcludePage(normalizedPath)) {
    return null;
  }

  const url = new URL(normalizedPath, SITE_ORIGIN);

  return {
    loc: url.toString(),
    lastmod: getLastModified(normalizedPath).toISOString(),
    changefreq: getChangeFreq(normalizedPath),
    priority: getPriority(normalizedPath)
  };
}

function buildXml(entries: Array<ReturnType<typeof createEntry>>): string {
  const urlEntries = entries
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .map(entry => {
      const priority = entry.priority.toFixed(1);
      return [
        '  <url>',
        `    <loc>${entry.loc}</loc>`,
        `    <lastmod>${entry.lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>'
  ]
    .filter(Boolean)
    .join('\n');
}

export const prerender = true;

export const GET: APIRoute = async () => {
  const blogPosts = await getCollection('blog');
  const services = await getServices();
  const locations = await getLocations();
  const hubs = locations.filter(location => location.isHub);

  const pathCandidates = buildSitemapPathCandidates({
    staticRoutes: STATIC_ROUTES,
    dynamicServiceSlugs: DYNAMIC_SERVICE_SLUGS,
    services,
    locations,
    hubs,
    blogPosts,
  });

  const uniquePaths = Array.from(new Set(pathCandidates.map(normalizePathForSitemap)));

  const entries = uniquePaths.map(createEntry);

  const xml = buildXml(entries);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600'
    }
  });
};
