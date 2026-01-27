import { defineConfig } from 'astro/config';
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
        const excludedPaths = new Set();

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
