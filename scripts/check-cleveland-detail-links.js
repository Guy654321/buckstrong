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

if (failures.length) {
  console.error('[cleveland-detail-check] ' + failures.join('\n[cleveland-detail-check] '));
  process.exitCode = 1;
} else {
  console.log(`[cleveland-detail-check] ${destinations.size} detail links resolve to Cleveland pages with local metadata and forms.`);
}
