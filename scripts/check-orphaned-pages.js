#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

function normalizeSiteOrigin(candidate) {
  const fallback = process.env.PUBLIC_SITE_URL?.trim() || 'https://buckstronggaragedoors.com';
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

const SITE_ORIGIN = normalizeSiteOrigin(process.env.PUBLIC_SITE_URL);
const STATIC_DIR = join(process.cwd(), '.vercel/output/static');
const SITEMAP_INDEX = join(STATIC_DIR, 'sitemap-index.xml');
const PRIMARY_SITEMAP = join(STATIC_DIR, 'sitemap.xml');

function fail(message) {
  console.error(`\n[orphan-check] ${message}`);
  process.exitCode = 1;
}

if (!existsSync(STATIC_DIR)) {
  fail('Static build output not found. Run `npm run build` before checking for orphaned pages.');
  process.exit();
}

const sitemapFiles = new Set();
if (existsSync(SITEMAP_INDEX)) {
  const indexXml = readFileSync(SITEMAP_INDEX, 'utf8');
  for (const match of indexXml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
    try {
      const url = new URL(match[1].trim());
      if (url.origin !== SITE_ORIGIN) continue;
      const fileName = url.pathname.replace(/^\//, '');
      const localPath = join(STATIC_DIR, fileName);
      if (existsSync(localPath)) {
        sitemapFiles.add(localPath);
      } else {
        fail(`Referenced sitemap segment not found: ${fileName}`);
      }
    } catch {
      fail(`Unable to parse sitemap index location: ${match[1]}`);
    }
  }
}

if (sitemapFiles.size === 0) {
  if (existsSync(PRIMARY_SITEMAP)) {
    sitemapFiles.add(PRIMARY_SITEMAP);
  } else {
    fail('No sitemap file found in build output.');
    process.exit();
  }
}

function normalizePath(pathname) {
  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  if (pathname === '/') {
    return pathname;
  }

  if (extname(pathname)) {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function filePathToRoute(filePath) {
  const relativePath = relative(STATIC_DIR, filePath).replace(/\\/g, '/');
  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return normalizePath(`/${relativePath.slice(0, -'index.html'.length)}`);
  }

  return normalizePath(`/${relativePath}`);
}

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectHtmlFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractLinks(html, pageRoute) {
  const links = new Set();
  const base = new URL(pageRoute, SITE_ORIGIN);

  for (const match of html.matchAll(/href\s*=\s*"([^"]+)"/gi)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith('#')) continue;
    if (/^(mailto:|tel:|javascript:)/i.test(raw)) continue;

    try {
      const resolved = new URL(raw, base);
      if (resolved.origin !== SITE_ORIGIN) continue;
      links.add(normalizePath(resolved.pathname));
    } catch {
      // Ignore malformed URLs
    }
  }

  return links;
}

function gatherSitemapRoutes() {
  const routes = new Set();
  for (const sitemapPath of sitemapFiles) {
    const xml = readFileSync(sitemapPath, 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
      try {
        const url = new URL(match[1].trim());
        if (url.origin !== SITE_ORIGIN) continue;
        routes.add(normalizePath(url.pathname));
      } catch {
        fail(`Unable to parse sitemap entry: ${match[1]}`);
      }
    }
  }
  return routes;
}

const sitemapRoutes = gatherSitemapRoutes();
const inboundLinks = new Map();

const htmlFiles = await collectHtmlFiles(STATIC_DIR);
for (const filePath of htmlFiles) {
  const pageRoute = filePathToRoute(filePath);
  const html = readFileSync(filePath, 'utf8');
  const links = extractLinks(html, pageRoute);

  for (const targetRoute of links) {
    if (!inboundLinks.has(targetRoute)) {
      inboundLinks.set(targetRoute, new Set());
    }
    inboundLinks.get(targetRoute)?.add(pageRoute);
  }
}

const orphaned = [];
for (const route of sitemapRoutes) {
  if (route === '/') continue;
  const sources = inboundLinks.get(route);
  if (!sources) {
    orphaned.push({ route, sources: [] });
    continue;
  }

  const filteredSources = Array.from(sources).filter(source => source !== route);
  if (filteredSources.length === 0) {
    orphaned.push({ route, sources: filteredSources });
  }
}

if (orphaned.length > 0) {
  fail('Found orphaned pages listed in the sitemap:');
  for (const { route } of orphaned) {
    console.error(`  • ${route}`);
  }
  console.error('\nAdd internal links to these pages or remove them from the sitemap.');
  process.exit(1);
}

console.log('[orphan-check] All sitemap pages have internal links.');
