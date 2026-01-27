import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const locationsDir = path.join(projectRoot, 'src', 'content', 'locations');
const vercelConfigPath = path.join(projectRoot, 'vercel.json');
const mappingDocPath = path.join(projectRoot, 'docs', 'legacy-location-redirects.md');

const manualLegacySlugMap = new Map([
  ['louisville-worthington', 'worthington-hills'],
]);

function loadLocationEntries() {
  const files = globSync('**/*.json', { cwd: locationsDir, absolute: true });
  return files.map((filePath) => {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      ...data,
      filePath,
    };
  });
}

function buildLegacySlugMapping(entries) {
  const canonicalSlugs = new Set(entries.map((entry) => entry.slug));
  const mapping = [];

  for (const entry of entries) {
    const { slug, state } = entry;

    if (!slug?.startsWith('louisville-')) {
      continue;
    }

    let legacySlug = manualLegacySlugMap.get(slug);

    if (!legacySlug) {
      legacySlug = slug.replace(/^louisville-/, '');
      if (state === 'IN') {
        legacySlug = legacySlug.replace(/-in$/, '');
      }
    }

    if (!legacySlug || canonicalSlugs.has(legacySlug)) {
      continue;
    }

    mapping.push({
      legacySlug,
      targetSlug: slug,
    });
  }

  return mapping.sort((a, b) => a.legacySlug.localeCompare(b.legacySlug));
}

function loadVercelConfig() {
  const configRaw = fs.readFileSync(vercelConfigPath, 'utf8');
  return JSON.parse(configRaw);
}

function mergeRedirects(config, slugMapping) {
  const redirects = Array.isArray(config.redirects) ? [...config.redirects] : [];
  const existingSources = new Set(redirects.map((redirect) => redirect.source));

  for (const { legacySlug, targetSlug } of slugMapping) {
    const baseSource = `/locations/${legacySlug}`;
    const destination = `/locations/${targetSlug}`;

    const candidates = [
      { source: baseSource, destination, permanent: true },
      { source: `${baseSource}/`, destination, permanent: true },
    ];

    for (const candidate of candidates) {
      if (!existingSources.has(candidate.source)) {
        redirects.push(candidate);
        existingSources.add(candidate.source);
      }
    }
  }

  return {
    ...config,
    redirects,
  };
}

function writeVercelConfig(config) {
  fs.writeFileSync(vercelConfigPath, `${JSON.stringify(config, null, 2)}\n`);
}

function writeMappingDoc(slugMapping) {
  const rows = slugMapping
    .map(({ legacySlug, targetSlug }) => `| /locations/${legacySlug} | /locations/${targetSlug} |`)
    .join('\n');

  const doc = `# Legacy location slug redirects\n\n` +
    `These redirects map legacy Louisville location URLs (from the Search Console Valid export) to the new market-prefixed slugs.\n\n` +
    `| Legacy path | Canonical location |\n` +
    `| --- | --- |\n` +
    `${rows}\n`;

  fs.writeFileSync(mappingDocPath, doc);
}

const locations = loadLocationEntries();
const legacySlugMapping = buildLegacySlugMapping(locations);
const vercelConfig = loadVercelConfig();
const updatedConfig = mergeRedirects(vercelConfig, legacySlugMapping);

writeVercelConfig(updatedConfig);
writeMappingDoc(legacySlugMapping);

console.log(`Added ${legacySlugMapping.length} legacy slug redirects.`);
console.log(`Updated ${path.relative(projectRoot, vercelConfigPath)} and ${path.relative(projectRoot, mappingDocPath)}.`);
