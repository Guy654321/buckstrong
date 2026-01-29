import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import icon from 'astro-icon';

const DEFAULT_SITE_ORIGIN = process.env.PUBLIC_SITE_URL?.trim() || 'https://derbystronggaragedoors.com';

function normalizeSiteOrigin(candidate, fallback = DEFAULT_SITE_ORIGIN) {
  if (!candidate) return fallback;

  const trimmed = candidate.trim().replace(/\/+$/, '');
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.toString();
  } catch {
    return fallback;
  }
}

const siteOrigin = normalizeSiteOrigin(process.env.PUBLIC_SITE_URL, DEFAULT_SITE_ORIGIN);
const LOCATIONS_DIR = path.resolve(process.cwd(), 'src', 'content', 'locations');
const HUB_SLUGS = (() => {
  try {
    const entries = fs.readdirSync(LOCATIONS_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => {
        const raw = fs.readFileSync(path.join(LOCATIONS_DIR, entry.name), 'utf-8');
        const data = JSON.parse(raw);
        return typeof data?.slug === 'string' ? data.slug.trim() : '';
      })
      .filter((slug) => slug.length > 0);
  } catch {
    return [];
  }
})();

export default defineConfig({
  site: siteOrigin,
  image: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      avif: 60,
      webp: 70,
      jpeg: 80
    },
    breakpoints: [320, 480, 768, 1024, 1280, 1600]
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    mdx(),
    sitemap({
      filter(page) {
        const excludedPaths = new Set(HUB_SLUGS.map((slug) => `/${slug}`));
        const resolvePathname = (input) => {
          if (!input) {
            return '';
          }

          if (input instanceof URL) {
            return input.pathname;
          }

          if (typeof input === 'object' && typeof input.pathname === 'string') {
            return input.pathname;
          }

          if (typeof input === 'string') {
            try {
              return new URL(input, siteOrigin).pathname;
            } catch {
              return input;
            }
          }

          return '';
        };

        const rawPathname = resolvePathname(page?.url ?? page?.pathname ?? page ?? '');
        const normalizedPathname =
          rawPathname && rawPathname !== '/'
            ? rawPathname.replace(/\/+$/, '')
            : rawPathname || '/';

        if (excludedPaths.has(normalizedPathname)) {
          return false;
        }

        try {
          const url = new URL(page?.url ?? '', siteOrigin);
          if (excludedPaths.has(url.pathname.replace(/\/+$/, '') || '/')) {
            return false;
          }
        } catch {
          if (page?.url && excludedPaths.has(page.url.replace(/\/+$/, '') || '/')) {
            return false;
          }
        }

        return true;
      },
      serialize(item) {
        const originalUrl = item?.url?.trim();

        if (!originalUrl) {
          return item;
        }

        let normalizedUrl = originalUrl;

        try {
          const parsed = new URL(originalUrl);

          if (parsed.pathname && parsed.pathname !== '/') {
            parsed.pathname = parsed.pathname.replace(/\/+$/, '');
          }

          normalizedUrl = parsed.toString();
        } catch {
          if (originalUrl !== '/') {
            normalizedUrl = originalUrl.replace(/\/+$/, '') || '/';
          }
        }

        if (normalizedUrl === originalUrl) {
          return item;
        }

        return {
          ...item,
          url: normalizedUrl
        };
      }
    }),
    icon({
      include: ['mdi']
    })
  ],
  output: 'hybrid',
  adapter: vercel(),
  build: {
    // Inline all generated CSS to remove render-blocking stylesheets that were
    // delaying Largest Contentful Paint on first navigation, while keeping
    // Astro's other build optimizations intact.
    inlineStylesheets: 'always'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            const logicalName = assetInfo.names?.[0] ?? assetInfo.fileName ?? '';

            if (logicalName.endsWith('.css')) {
              return '_astro/[name][extname]';
            }

            return '_astro/[name].[hash][extname]';
          }
        }
      }
    }
  }
});
