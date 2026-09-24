import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.vercel/output/static');
const origin = 'https://www.buckstronggaragedoors.com';
const overviews = [
  { route: '/cleveland-oh/garage-door-repair', count: 10 },
  { route: '/cleveland-oh/opener-repair', count: 4 },
  { route: '/cleveland-oh/garage-door-installation', count: 4 },
  { route: '/cleveland-oh/commercial-jobs', count: 3 },
];
const failures = [];
const destinations = new Set();
const repairSlugs = [
  'spring-replacement', 'opener-repair', 'cable-repair', 'track-alignment',
  'panel-replacement', 'rollers-hinges', 'sensor-alignment', 'weatherstripping',
  'maintenance', 'balance-adjustment',
];
const suburbDetailGroups = [
  { overview: 'garage-door-repair', slugs: repairSlugs, prefix: '' },
  { overview: 'opener-repair', slugs: ['belt-drive-repair', 'chain-drive-repair', 'jackshaft-opener-repair', 'screw-drive-opener-repair'], prefix: 'opener-' },
  { overview: 'garage-door-installation', slugs: ['steel-garage-doors', 'wood-garage-doors', 'aluminum-garage-doors', 'carriage-house-garage-doors'], prefix: '' },
  { overview: 'commercial-jobs', slugs: ['warehouse-distribution-door-service', 'dock-industrial-door-equipment-service', 'retail-municipal-garage-door-service'], prefix: 'commercial-' },
];
const generalServiceRoutes = [
  { route: '/services/garage-door-repair', group: suburbDetailGroups[0] },
  { route: '/services/opener-repair', group: suburbDetailGroups[1] },
  { route: '/services/garage-door-installation', group: suburbDetailGroups[2] },
  { route: '/services/commercial-jobs', group: suburbDetailGroups[3] },
];

const htmlFor = (route) => {
  const file = path.join(root, route.slice(1), 'index.html');
  if (!fs.existsSync(file)) {
    failures.push(`Missing page: ${route}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
};

for (const { route, count } of overviews) {
  const html = htmlFor(route);
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const details = [...new Set(hrefs.filter((href) =>
    href.startsWith('/cleveland-oh/garage-door-') && href !== '/cleveland-oh/garage-door-repair' && href !== '/cleveland-oh/garage-door-installation'
    || href.startsWith('/garage-door-') && href.endsWith('-cleveland-oh')
  ))];
  if (details.length !== count) failures.push(`${route}: expected ${count} distinct detail links, found ${details.length}`);
  details.forEach((detail) => destinations.add(detail));
}

if (destinations.size !== 21) failures.push(`Expected 21 distinct detail destinations, found ${destinations.size}`);

for (const { route, group } of generalServiceRoutes) {
  const html = htmlFor(route);
  for (const slug of group.slugs) {
    const marketRoute = group.overview === 'garage-door-repair'
      ? (market) => `/${market}-oh/garage-door-${slug}`
      : (market) => `/garage-door-${group.prefix}${slug}-${market}-oh`;
    for (const market of ['cincinnati', 'cleveland']) {
      if (!html.includes(`href="${marketRoute(market)}"`)) failures.push(`${route}: missing ${market} ${slug} detail link`);
    }
  }
}

for (const route of destinations) {
  const html = htmlFor(route);
  if (!html) continue;
  if (!html.includes(`<link rel="canonical" href="${origin}${route}"`)) failures.push(`${route}: canonical mismatch`);
  if (!html.includes('in Cleveland, OH</h1>')) failures.push(`${route}: Cleveland H1 missing`);
  if (!html.includes('216') || !html.includes('24500 Center Ridge Rd')) failures.push(`${route}: Cleveland phone or address missing`);
  const head = html.slice(0, html.indexOf('<body'));
  if (!head.includes('24500 Center Ridge Rd') || head.includes('2337 Victory Parkway')) failures.push(`${route}: market address metadata is incorrect`);
  if (!html.includes('action="/api/contact"') || !html.includes('data-contact-form')) failures.push(`${route}: quote form missing`);
  const contentStart = html.indexOf('<section class="py-16 bg-muted"');
  const contentEnd = html.indexOf('<section id="service-quote"', contentStart);
  if (contentStart < 0 || contentEnd < 0 || html.slice(contentStart, contentEnd).includes('Cincinnati')) {
    failures.push(`${route}: service content missing or contains Cincinnati copy`);
  }
}

const suburbFiles = fs.readdirSync('src/content/locations/cleveland')
  .filter((file) => file.endsWith('.json'));
const localTitles = new Map();
for (const file of suburbFiles) {
  const location = JSON.parse(fs.readFileSync(path.join('src/content/locations/cleveland', file), 'utf8'));
  const citySlug = location.slug.replace(/^cleveland-/, '');
  for (const group of suburbDetailGroups) {
    const overviewRoute = `/${citySlug}-oh/${group.overview}`;
    const overview = htmlFor(overviewRoute);
    for (const slug of group.slugs) {
    const route = `/${citySlug}-oh/garage-door-${group.prefix}${slug}`;
    if (!overview.includes(`href="${route}"`)) failures.push(`${overviewRoute}: missing ${slug} detail link`);
    const html = htmlFor(route);
    if (!html) continue;
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    if (!title || localTitles.has(title)) failures.push(`${route}: missing or duplicate title${localTitles.has(title) ? ` (also ${localTitles.get(title)})` : ''}`);
    else localTitles.set(title, route);
    if (!html.includes(`<link rel="canonical" href="${origin}${route}"`)) failures.push(`${route}: canonical mismatch`);
    if (!html.includes(`in ${location.name}, OH</h1>`)) failures.push(`${route}: local H1 missing`);
    if (!html.includes(`href="${overviewRoute}"`)) failures.push(`${route}: local overview link missing`);
    if (!html.includes(`href="/locations/${location.slug}"`)) failures.push(`${route}: local breadcrumb link missing`);
    if (!html.includes('action="/api/contact"') || !html.includes('data-contact-form')) failures.push(`${route}: quote form missing`);
    const head = html.slice(0, html.indexOf('<body'));
    if (!head.includes('24500 Center Ridge Rd') || head.includes('2337 Victory Parkway')) failures.push(`${route}: market address metadata is incorrect`);
    const content = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
    const localEvidence = group.overview === 'garage-door-installation' ? location.localAdvice
      : group.overview === 'commercial-jobs' ? `For a ${location.name} facility`
      : location.localIntro;
    if (!content.includes(localEvidence) || content.includes('Cincinnati')) failures.push(`${route}: local content missing or contains Cincinnati copy`);
    const sectionBackgrounds = [...content.matchAll(/<section[^>]*class="([^"]+)"/g)]
      .map((match) => match[1].match(/\bbg-(?:muted|white)\b/)?.[0]);
    const expectedBackgrounds = ['bg-muted', 'bg-white', 'bg-muted', 'bg-white', 'bg-muted', 'bg-white', 'bg-muted'];
    if (sectionBackgrounds.slice(0, expectedBackgrounds.length).join(',') !== expectedBackgrounds.join(',')) {
      failures.push(`${route}: section backgrounds do not alternate`);
    }
    }
  }
}

if (failures.length) {
  console.error('[cleveland-detail-check] ' + failures.join('\n[cleveland-detail-check] '));
  process.exitCode = 1;
} else {
  console.log(`[cleveland-detail-check] ${destinations.size} market and ${suburbFiles.length * suburbDetailGroups.reduce((sum, group) => sum + group.slugs.length, 0)} suburb service details resolve with local metadata and forms.`);
}
