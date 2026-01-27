import fs from 'fs';
import path from 'path';

/**
 * Sitemap utility functions for advanced sitemap management
 */

const SITE_URL_FALLBACK = process.env.PUBLIC_SITE_URL?.trim() || 'https://derbystronggaragedoors.com';

function normalizeSiteOrigin(candidate) {
  const fallback = SITE_URL_FALLBACK;
  if (!candidate) return fallback;

  const trimmed = candidate.trim().replace(/\/+$/, '');
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);

    if (parsed.hostname.endsWith('.vercel.app')) {
      return fallback;
    }

    return parsed.toString();
  } catch {
    return fallback;
  }
}

const DEFAULT_SITE_ORIGIN = normalizeSiteOrigin(process.env.PUBLIC_SITE_URL);
const VALID_CHANGE_FREQUENCIES = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
const HTTPS_PROTOCOL = 'https:';
const EXCLUDE_PATTERNS = [
  '/404',
  '/500',
  '/admin',
  '/private',
  '/search',
  '/temp',
  '/preview',
  '/draft',
  '/api'
];

function normalizeRoutePath(pathname = '/') {
  let normalized = pathname ?? '/';

  if (!normalized || typeof normalized !== 'string') {
    return '/';
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  if (normalized !== '/') {
    normalized = normalized.replace(/\/+$/, '');
  }

  return normalized || '/';
}

/**
 * Get last modified date for different page types
 * @param {string} pathname - The page pathname
 * @returns {Date} - Last modified date
 */
export function getLastModified(pathname) {
  const normalizedPath = normalizeRoutePath(pathname);

  // Use more realistic dates based on actual content update patterns
  const baseDate = new Date('2024-09-15'); // Base date for most static content

  // For blog posts, you might want to use actual post dates
  if (normalizedPath.startsWith('/blog/')) {
    // Use actual blog post dates - most recent posts
    if (normalizedPath.includes('emergency-garage-door-repair')) {
      return new Date('2024-01-25');
    } else if (normalizedPath.includes('spring-replacement-guide')) {
      return new Date('2024-01-20');
    } else if (normalizedPath.includes('maintenance-checklist')) {
      return new Date('2024-01-15');
    }
    // Default for other blog posts
    return new Date('2024-01-15');
  }

  // For service pages, less frequent updates
  if (normalizedPath.startsWith('/services/')) {
    return new Date('2024-09-10'); // Updated when service content was last modified
  }

  // For location pages, monthly updates
  if (normalizedPath.startsWith('/locations/')) {
    return new Date('2024-09-01'); // Location content updates
  }

  // Homepage gets updated more frequently
  if (normalizedPath === '/') {
    return new Date('2024-09-15');
  }

  // FAQ and contact pages

  if (pathname === '/faq' || pathname === '/contact') {

    return new Date('2024-09-05');
  }

  // Default to base date for other pages
  return baseDate;
}

/**
 * Determine change frequency based on page type
 * @param {string} pathname - The page pathname
 * @returns {string} - Change frequency
 */
export function getChangeFreq(pathname) {
  const normalizedPath = normalizeRoutePath(pathname);

  // Homepage changes frequently
  if (normalizedPath === '/') return 'daily';

  // Blog content changes regularly
  if (normalizedPath.startsWith('/blog/')) return 'weekly';

  // Service pages change occasionally
  if (normalizedPath.startsWith('/services/')) return 'weekly';

  // Location pages are more static
  if (normalizedPath.startsWith('/locations/')) return 'monthly';

  // Other pages change infrequently
  return 'monthly';
}

/**
 * Calculate priority based on page importance and type
 * @param {string} pathname - The page pathname
 * @returns {number} - Priority value between 0.0 and 1.0
 */
export function getPriority(pathname) {
  const normalizedPath = normalizeRoutePath(pathname);

  // Homepage is most important
  if (normalizedPath === '/') return 1.0;

  // Main service pages are very important
  if (normalizedPath.match(/^\/services\/(garage-door-repair|opener-repair|commercial-jobs)$/)) {
    return 0.9;
  }

  // Service category and location pages
  if (pathname === '/services' || pathname === '/locations') return 0.8;

  // Individual location pages are important for local SEO
  if (pathname.startsWith('/locations/') && pathname !== '/locations') return 0.8;


  // FAQ and blog index pages
  if (normalizedPath.match(/^\/(faq|blog)$/)) return 0.7;

  // Individual blog posts
  if (normalizedPath.startsWith('/blog/') && normalizedPath !== '/blog') return 0.6;

  // Contact and other pages
  if (normalizedPath.match(/^\/(contact|safety)$/)) return 0.6;

  // Default priority
  return 0.5;
}

/**
 * Normalize a pathname ensuring leading slash and directory style suffix.
 * @param {string} pathname
 * @returns {string}
 */
function normalizePathname(pathname = '/') {
  let normalized = pathname || '/';

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.replace(/\/+/g, '/').replace(/\/+$/, '');
  }

  return normalized;
}

/**
 * Resolve a pathname from various input types.
 * @param {string | URL | { url?: string }} input
 * @returns {string}
 */
function resolvePathname(input) {
  if (!input) {
    return '';
  }

  if (input instanceof URL) {
    return normalizePathname(input.pathname);
  }

  if (typeof input === 'string') {
    const parsed = tryParseUrl(input, DEFAULT_SITE_ORIGIN);

    if (parsed) {
      return normalizePathname(parsed.pathname);
    }

    return normalizePathname(input);
  }

  if (typeof input === 'object' && typeof input.url === 'string') {
    return resolvePathname(input.url);
  }

  return '';
}

/**
 * Check if a page should be excluded from sitemap
 * @param {string | URL | { url?: string }} value - URL or pathname to evaluate
 * @returns {boolean} - True if page should be excluded
 */
export function shouldExcludePage(value) {
  const pathname = resolvePathname(value);

  if (!pathname) {
    return false;
  }

  return EXCLUDE_PATTERNS.some(pattern => pathname.startsWith(pattern));
}

function tryParseUrl(candidate, base) {
  if (!candidate) return null;

  try {
    if (typeof URL.canParse === 'function') {
      if (URL.canParse(candidate, base)) {
        return new URL(candidate, base);
      }
    }

    return new URL(candidate, base);
  } catch {
    return null;
  }
}

function normalizeForComparison(candidate) {
  const parsed = tryParseUrl(candidate, DEFAULT_SITE_ORIGIN);

  if (!parsed) {
    return candidate;
  }

  let pathname = parsed.pathname || '/';

  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, '');
  }

  parsed.pathname = pathname || '/';

  return parsed.toString();
}

function areUrlsEquivalent(a, b) {
  try {
    return normalizeForComparison(a) === normalizeForComparison(b);
  } catch {
    return a === b;
  }
}

function normalizeCanonical(candidate, siteOrigin) {
  const parsed = tryParseUrl(candidate, siteOrigin ?? DEFAULT_SITE_ORIGIN);
  if (!parsed) {
    return null;
  }

  if (parsed.pathname && parsed.pathname.length > 1) {
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  }

  if (!parsed.pathname) {
    parsed.pathname = '/';
  }

  return parsed.toString();
}

function deriveSnapshotPath(pathname, outputDir, fileExists) {
  if (!outputDir) {
    return null;
  }

  const clean = pathname.replace(/^\//, '');
  const segments = [];

  if (!clean) {
    segments.push('index');
  } else {
    segments.push(clean);
  }

  const candidates = new Set();

  for (const segment of segments) {
    const base = segment.replace(/\/+$/, '');

    if (!base) {
      candidates.add(path.join(outputDir, 'index.html'));
      candidates.add(path.join(outputDir, 'index.json'));
      continue;
    }

    const withSlash = base.endsWith('/') ? base : `${base}/`;

    candidates.add(path.join(outputDir, withSlash, 'index.html'));
    candidates.add(path.join(outputDir, withSlash, 'index.json'));

    candidates.add(path.join(outputDir, `${base}.html`));
    candidates.add(path.join(outputDir, `${base}.json`));
  }

  for (const candidate of candidates) {
    if (fileExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

function defaultGetSnapshot(meta, context) {
  const filePath = deriveSnapshotPath(meta.pathname, context.outputDir, context.fileExists);

  if (!filePath) {
    return null;
  }

  return {
    type: filePath.endsWith('.json') ? 'json' : 'html',
    content: context.readFile(filePath, 'utf8'),
    source: filePath
  };
}

function normalizeSnapshot(snapshot) {
  if (!snapshot) {
    return null;
  }

  if (typeof snapshot === 'string') {
    return { type: 'html', content: snapshot };
  }

  if (typeof snapshot === 'object') {
    if (typeof snapshot.content === 'string') {
      return {
        type: snapshot.type === 'json' ? 'json' : 'html',
        content: snapshot.content,
        source: snapshot.source ?? snapshot.filePath ?? null
      };
    }

    if (typeof snapshot.html === 'string') {
      return {
        type: 'html',
        content: snapshot.html,
        source: snapshot.source ?? null
      };
    }
  }

  return null;
}

function extractCanonicalsFromHtml(html) {
  const canonicalTags = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi) || [];

  return canonicalTags
    .map(tag => {
      const match = tag.match(/href=["']([^"']+)["']/i);
      return match ? match[1].trim() : null;
    })
    .filter(Boolean);
}

function extractCanonicalsFromJson(jsonContent) {
  const canonicals = [];
  const slugs = [];

  try {
    const data = JSON.parse(jsonContent);
    const stack = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      if (!current) {
        continue;
      }

      if (Array.isArray(current)) {
        for (const value of current) {
          if (typeof value === 'object' || Array.isArray(value)) {
            stack.push(value);
          }
        }
        continue;
      }

      if (typeof current === 'object') {
        for (const [key, value] of Object.entries(current)) {
          if (typeof value === 'string') {
            if (key.toLowerCase().includes('canonical')) {
              canonicals.push(value);
            }

            if (key.toLowerCase() === 'slug') {
              slugs.push(value);
            }
          } else if (value && (typeof value === 'object' || Array.isArray(value))) {
            stack.push(value);
          }
        }
      }
    }
  } catch {
    return { canonicals: [], slugs: [] };
  }

  return {
    canonicals: canonicals.filter(Boolean),
    slugs
  };
}

function enrichUrlMeta(rawUrl, siteOrigin) {
  const parsed = tryParseUrl(rawUrl, siteOrigin ?? DEFAULT_SITE_ORIGIN);

  if (!parsed) {
    return null;
  }

  return {
    href: parsed.toString(),
    origin: parsed.origin,
    protocol: parsed.protocol,
    pathname: parsed.pathname || '/'
  };
}

/**
 * Validate sitemap URLs for quality assurance
 * @param {Array} urls - Array of URL objects
 * @param {object} options - Validation options
 * @returns {Object} - Validation results
 */
export function validateSitemapUrls(urls, options = {}) {
  const {
    siteOrigin = DEFAULT_SITE_ORIGIN,
    outputDir = null,
    getSnapshot = undefined,
    fileExists = fs.existsSync,
    readFile = filePath => fs.readFileSync(filePath, 'utf8')
  } = options;

  const results = {
    total: urls.length,
    valid: 0,
    warnings: [],
    errors: [],
    audits: []
  };

  const canonicalUsage = new Map();

  urls.forEach((urlObj, index) => {
    const meta = enrichUrlMeta(urlObj?.url, siteOrigin);
    const audit = {
      index: index + 1,
      url: urlObj?.url ?? '',
      normalizedUrl: meta?.href ?? null,
      snapshotType: getSnapshot || outputDir ? 'pending' : 'skipped',
      filePath: null,
      canonicalLinks: [],
      slugHints: []
    };

    if (!meta) {
      results.errors.push(`URL ${index + 1}: Invalid URL format - ${urlObj?.url ?? '<empty>'}`);
      results.audits.push(audit);
      return;
    }

    let hasError = false;

    if (meta.protocol !== HTTPS_PROTOCOL) {
      results.warnings.push(`URL ${index + 1}: Not using HTTPS - ${meta.href}`);
    }

    if (typeof urlObj.priority !== 'undefined' && (urlObj.priority < 0 || urlObj.priority > 1)) {
      results.errors.push(`URL ${index + 1}: Invalid priority value - ${urlObj.priority}`);
      hasError = true;
    }

    if (urlObj.changefreq && !VALID_CHANGE_FREQUENCIES.includes(urlObj.changefreq)) {
      results.errors.push(`URL ${index + 1}: Invalid changefreq - ${urlObj.changefreq}`);
      hasError = true;
    }

    const context = { outputDir, fileExists, readFile, siteOrigin };
    const shouldAudit = Boolean(getSnapshot || outputDir);

    if (shouldAudit) {
      const rawSnapshot = (typeof getSnapshot === 'function' ? getSnapshot(meta, context) : undefined) ??
        defaultGetSnapshot(meta, context);
      const snapshot = normalizeSnapshot(rawSnapshot);

      if (!snapshot) {
        audit.snapshotType = 'missing';
        results.warnings.push(`URL ${index + 1}: Unable to audit canonical tags - ${meta.href}`);
      } else {
        audit.snapshotType = snapshot.type;
        audit.filePath = snapshot.source ?? null;

        if (snapshot.type === 'json') {
          const info = extractCanonicalsFromJson(snapshot.content);
          audit.canonicalLinks = info.canonicals;
          audit.slugHints = info.slugs;
        } else {
          audit.canonicalLinks = extractCanonicalsFromHtml(snapshot.content);
        }

        if (audit.canonicalLinks.length === 0) {
          results.warnings.push(`URL ${index + 1}: Missing canonical link tag - ${meta.href}`);
        } else {
          audit.canonicalLinks.forEach(link => {
            const normalizedCanonical = normalizeCanonical(link, siteOrigin);

            if (!normalizedCanonical) {
              results.warnings.push(`URL ${index + 1}: Canonical link has invalid href - ${link}`);
              return;
            }

            if (!areUrlsEquivalent(normalizedCanonical, meta.href)) {
              results.warnings.push(
                `URL ${index + 1}: Canonical (${normalizedCanonical}) does not match sitemap URL (${meta.href})`
              );
            } else if (normalizedCanonical !== meta.href) {
              results.errors.push(
                `URL ${index + 1}: Sitemap URL (${meta.href}) should match canonical format (${normalizedCanonical}) exactly`
              );
            }

            if (!canonicalUsage.has(normalizedCanonical)) {
              canonicalUsage.set(normalizedCanonical, new Set());
            }

            canonicalUsage.get(normalizedCanonical).add(meta.href);
          });
        }
      }
    }

    if (!hasError) {
      results.valid += 1;
    }

    results.audits.push(audit);
  });

  canonicalUsage.forEach((pages, canonical) => {
    if (pages.size > 1) {
      results.warnings.push(`Duplicate canonical detected (${canonical}) used by: ${Array.from(pages).join(', ')}`);
    }
  });

  return results;
}
