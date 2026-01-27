#!/usr/bin/env node

/**
 * Sitemap validation script for development and CI/CD
 * Run with: node scripts/validate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import process from 'process';
import { validateSitemapUrls } from '../src/utils/sitemap-utils.js';


  
const OUTPUT_DIR_CANDIDATES = [
  path.join(process.cwd(), '.vercel', 'output', 'static'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), 'public')
];



const status = {
  info(message) {
    console.log(`ℹ️  ${message}`);
  },
  success(message) {
    console.log(`✅ ${message}`);
  },
  warn(message) {
    console.warn(`⚠️  ${message}`);
  },
  error(message) {
    console.error(`❌ ${message}`);
  }
};

function resolveOutputFile(relativePath) {
  for (const outputDir of OUTPUT_DIR_CANDIDATES) {
    const candidate = path.join(outputDir, relativePath);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}


function findSitemapIndex() {
  return resolveOutputFile('sitemap-index.xml');
}


function extractUrlEntries(xmlContent) {
  const entries = [];

  for (const match of xmlContent.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = match[1];
    const locMatch = block.match(/<loc>(.*?)<\/loc>/);

    if (!locMatch) continue;

    const entry = { url: locMatch[1].trim() };
    const changefreqMatch = block.match(/<changefreq>(.*?)<\/changefreq>/);
    const priorityMatch = block.match(/<priority>(.*?)<\/priority>/);

    if (changefreqMatch) {
      entry.changefreq = changefreqMatch[1].trim();
    }



    if (priorityMatch) {
      const priority = Number(priorityMatch[1]);
      if (!Number.isNaN(priority)) {
        entry.priority = priority;
      }
    }

    entries.push(entry);
  }

  return entries;
}

function collectUrlsFromSitemaps(sitemapPath, sitemapContent, warnings) {
  const urlEntries = [];

  if (sitemapContent.includes('<urlset')) {
    urlEntries.push(...extractUrlEntries(sitemapContent));
    return urlEntries;
  }

  const nestedSitemaps = Array.from(
    sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g),
    match => match[1].trim()
  );

  if (nestedSitemaps.length > 0) {
    status.info(`Found ${nestedSitemaps.length} nested sitemap reference(s) in ${path.basename(sitemapPath)}`);
  }

  nestedSitemaps.forEach((loc, index) => {
    let relativePath = loc;

    try {
      const parsed = new URL(loc);
      relativePath = parsed.pathname.replace(/^\/+/, '');
    } catch {
      relativePath = loc.replace(/^\/+/, '');
    }

    const nestedPath = relativePath ? resolveOutputFile(relativePath) : null;

    if (!nestedPath) {
      warnings.push(
        `Referenced sitemap ${index + 1} (${loc}) was not found relative to ${path.basename(sitemapPath)}`
      );
      return;
    }

    const nestedContent = fs.readFileSync(nestedPath, 'utf8');
    urlEntries.push(...collectUrlsFromSitemaps(nestedPath, nestedContent, warnings));
  });

  return urlEntries;
}



function deriveSiteOrigin(urls) {
  for (const entry of urls) {
    try {
      const parsed = new URL(entry.url);
      return parsed.origin;
    } catch {
      // ignore malformed URLs until validation
    }
  }

  return null;
}

function summarizeAudits(audits) {
  if (!audits || audits.length === 0) {
    return;
  }

  const attemptedAudits = audits.filter(audit => audit.snapshotType !== 'skipped');

  if (attemptedAudits.length === 0) {
    status.info('No canonical audits were performed (missing build output).');
    return;
  }

  const missingSnapshots = attemptedAudits.filter(audit => audit.snapshotType === 'missing');
  const missingCanonicals = attemptedAudits.filter(
    audit => audit.snapshotType !== 'missing' && audit.canonicalLinks.length === 0
  );

  if (missingSnapshots.length > 0) {
    status.warn('Pages without snapshots to audit canonical tags:');
    for (const audit of missingSnapshots) {
      status.warn(`   - ${audit.normalizedUrl ?? audit.url}`);
    }
  }

  if (missingCanonicals.length > 0) {
    status.warn('Pages missing canonical <link> tags:');
    for (const audit of missingCanonicals) {
      const slugHint = audit.slugHints && audit.slugHints.length > 0 ? ` (slug hint: ${audit.slugHints[0]})` : '';
      status.warn(`   - ${audit.normalizedUrl ?? audit.url}${slugHint}`);
    }
  }

  if (missingSnapshots.length === 0 && missingCanonicals.length === 0) {
    status.success('All audited pages include canonical tags.');
  }
}

function validateSitemap() {
  console.log('🔍 Validating sitemap...\n');

  const sitemapPath = findSitemapIndex();


  if (!sitemapPath) {
    status.error('Sitemap not found. Run `npm run build` first.');
    for (const outputDir of OUTPUT_DIR_CANDIDATES) {
      console.error(`   Looked for: ${path.join(outputDir, 'sitemap-index.xml')}`);

    }
    process.exit(1);
  }


  const relativePath = path.relative(process.cwd(), sitemapPath);
  status.success(`Sitemap index found at ${relativePath}`);
 

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  if (!sitemapContent.includes('<urlset') && !sitemapContent.includes('<sitemapindex')) {
    status.error('Invalid sitemap XML format');
    process.exit(1);
  }


  status.success('Sitemap XML format appears valid');


  const sitemapWarnings = [];
  const urlEntries = collectUrlsFromSitemaps(sitemapPath, sitemapContent, sitemapWarnings);

  if (urlEntries.length === 0) {
    status.error('No <url> entries found in the sitemap files.');
    process.exit(1);
  }


  status.success(`Discovered ${urlEntries.length} sitemap URL(s) for validation`);

  const siteOrigin = deriveSiteOrigin(urlEntries);


  if (siteOrigin) {
    status.success(`Detected site origin: ${siteOrigin}`);
  } else {
    status.warn('Unable to determine site origin from sitemap URLs');
  }

  const validationResults = validateSitemapUrls(urlEntries, {
    outputDir: path.dirname(sitemapPath),
    siteOrigin: siteOrigin ?? undefined
  });

  const warningSet = new Set([...sitemapWarnings, ...validationResults.warnings]);
  const errorSet = new Set(validationResults.errors);

  for (const entry of urlEntries) {
    const url = (entry.url ?? '').trim();

    if (!url) {
      errorSet.add('Found empty URL entries in sitemap');
      continue;
    }


    if (url.startsWith('http://')) {
      warningSet.add('Found HTTP URL - HTTPS is recommended for all sitemap entries');

    }

    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        errorSet.add('Found localhost URL in sitemap; update to the production domain');
      }
    } catch {
      // Already reported by validateSitemapUrls
    }
  }

  console.log('\n📊 Validation Results:');
  console.log(`   Total URLs: ${validationResults.total}`);
  console.log(`   Valid URLs: ${validationResults.valid}`);

  if (warningSet.size > 0) {
    console.log('\n⚠️  Warnings:');
    for (const warning of warningSet) {
      console.log(`   - ${warning}`);
    }
  }

  if (errorSet.size > 0) {
    console.log('\n❌ Errors:');
    for (const error of errorSet) {
      console.log(`   - ${error}`);
    }
    process.exit(1);
  }

  summarizeAudits(validationResults.audits);

  console.log('\n✅ Sitemap validation passed!');
  console.log('\n💡 SEO Recommendations:');
  console.log('   - Submit sitemap to Google Search Console');
  console.log('   - Submit sitemap to Bing Webmaster Tools');
  console.log('   - Monitor crawl errors regularly');
  console.log('   - Update sitemap after major site changes');
}

function validateRobotsTxt() {
  console.log('\n🤖 Checking robots.txt...');



  const robotsPath = resolveOutputFile('robots.txt');

  if (!robotsPath) {
    status.warn('robots.txt not found');
    return;
  }

  status.success(`robots.txt found at ${path.relative(process.cwd(), robotsPath)}`);

  const robotsContent = fs.readFileSync(robotsPath, 'utf8');


  if (/sitemap-index\.xml/i.test(robotsContent)) {
    status.success('robots.txt references sitemap correctly');
 
  } else {
    status.warn('robots.txt should reference sitemap-index.xml');
  }
}

try {
  validateSitemap();
  validateRobotsTxt();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  status.error(`Validation failed: ${message}`);
  process.exit(1);
}
