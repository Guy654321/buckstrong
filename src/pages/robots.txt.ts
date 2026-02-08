import type { APIRoute } from 'astro';
import { getSiteOrigin } from '../utils/site-origin';

const SITE_ORIGIN = getSiteOrigin();

const ROBOTS_BODY = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${new URL('/sitemap-index.xml', SITE_ORIGIN).toString()}`,
  ''
].join('\n');

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(ROBOTS_BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
