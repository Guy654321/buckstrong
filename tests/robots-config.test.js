import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const robotsRoute = fs.readFileSync(new URL('../src/pages/robots.txt.ts', import.meta.url), 'utf8');

test('robots route advertises only the canonical sitemap endpoint', () => {
  assert.ok(robotsRoute.includes("new URL('/sitemap.xml', SITE_ORIGIN)"));
  assert.ok(!robotsRoute.includes("new URL('/sitemap-index.xml', SITE_ORIGIN)"));
});
