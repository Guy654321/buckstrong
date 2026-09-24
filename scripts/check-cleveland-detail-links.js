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
  const overviewRoute = `/${citySlug}-oh/garage-door-repair`;
  const overview = htmlFor(overviewRoute);
  for (const slug of repairSlugs) {
    const route = `/${citySlug}-oh/garage-door-${slug}`;
    if (!overview.includes(`href="${route}"`)) failures.push(`${overviewRoute}: missing ${slug} detail link`);
    const html = htmlFor(route);
    if (!html) continue;
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    if (!title || localTitles.has(title)) failures.push(`${route}: missing or duplicate title${localTitles.has(title) ? ` (also ${localTitles.get(title)})` : ''}`);
    else localTitles.set(title, route);
    if (!html.includes(`<link rel="canonical" href="${origin}${route}"`)) failures.push(`${route}: canonical mismatch`);
    if (!html.includes(`in ${location.name}, OH</h1>`)) failures.push(`${route}: local H1 missing`);
    if (!html.includes(`href="${overviewRoute}"`)) failures.push(`${route}: local repair overview link missing`);
    if (!html.includes(`href="/locations/${location.slug}"`)) failures.push(`${route}: local breadcrumb link missing`);
    if (!html.includes('action="/api/contact"') || !html.includes('data-contact-form')) failures.push(`${route}: quote form missing`);
    const head = html.slice(0, html.indexOf('<body'));
    if (!head.includes('24500 Center Ridge Rd') || head.includes('2337 Victory Parkway')) failures.push(`${route}: market address metadata is incorrect`);
    const content = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
    if (!content.includes(location.localIntro) || content.includes('Cincinnati')) failures.push(`${route}: local content missing or contains Cincinnati copy`);
    const sectionBackgrounds = [...content.matchAll(/<section[^>]*class="([^"]+)"/g)]
      .map((match) => match[1].match(/\bbg-(?:muted|white)\b/)?.[0]);
    const expectedBackgrounds = ['bg-muted', 'bg-white', 'bg-muted', 'bg-white', 'bg-muted', 'bg-white', 'bg-muted'];
    if (sectionBackgrounds.slice(0, expectedBackgrounds.length).join(',') !== expectedBackgrounds.join(',')) {
      failures.push(`${route}: section backgrounds do not alternate`);
    }
  }
}

if (failures.length) {
  console.error('[cleveland-detail-check] ' + failures.join('\n[cleveland-detail-check] '));
  process.exitCode = 1;
} else {
  console.log(`[cleveland-detail-check] ${destinations.size} market and ${suburbFiles.length * repairSlugs.length} suburb repair details resolve with local metadata and forms.`);
}
