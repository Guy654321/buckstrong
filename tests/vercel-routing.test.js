import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const vercelConfig = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('vercel config does not expose stale vanity rewrites', () => {
  assert.deepEqual(vercelConfig.rewrites, []);
});

test('vercel config redirects http www requests straight to the canonical https www host', () => {
  const redirect = vercelConfig.redirects.find((entry) =>
    entry.source === '/(.*)' &&
    Array.isArray(entry.has) &&
    entry.has.some((condition) => condition.type === 'host' && condition.value === 'www.buckstronggaragedoors.com') &&
    entry.has.some((condition) => condition.type === 'header' && condition.key === 'x-forwarded-proto' && condition.value === 'http')
  );

  assert.ok(redirect, 'expected an explicit http->https www redirect');
  assert.equal(redirect.destination, 'https://www.buckstronggaragedoors.com/$1');
  assert.equal(redirect.permanent, true);
});

test('vercel config keeps the naked domain redirected to the canonical www host', () => {
  const redirect = vercelConfig.redirects.find((entry) =>
    entry.source === '/(.*)' &&
    Array.isArray(entry.has) &&
    entry.has.some((condition) => condition.type === 'host' && condition.value === 'buckstronggaragedoors.com')
  );

  assert.ok(redirect, 'expected a naked-domain canonical redirect');
  assert.equal(redirect.destination, 'https://www.buckstronggaragedoors.com/$1');
  assert.equal(redirect.permanent, true);
});

test('vercel config adds noindex robots headers to non-canonical host/protocol responses', () => {
  const nonWwwHeaderRule = vercelConfig.headers.find((entry) =>
    entry.source === '/(.*)' &&
    Array.isArray(entry.has) &&
    entry.has.some((condition) => condition.type === 'host' && condition.value === 'buckstronggaragedoors.com')
  );

  assert.ok(nonWwwHeaderRule, 'expected robots header rule for apex host responses');
  assert.ok(
    nonWwwHeaderRule.headers.some((header) => header.key === 'X-Robots-Tag' && header.value === 'noindex, follow'),
    'expected noindex robots header on apex host responses'
  );

  const httpWwwHeaderRule = vercelConfig.headers.find((entry) =>
    entry.source === '/(.*)' &&
    Array.isArray(entry.has) &&
    entry.has.some((condition) => condition.type === 'host' && condition.value === 'www.buckstronggaragedoors.com') &&
    entry.has.some((condition) => condition.type === 'header' && condition.key === 'x-forwarded-proto' && condition.value === 'http')
  );

  assert.ok(httpWwwHeaderRule, 'expected robots header rule for http www responses');
  assert.ok(
    httpWwwHeaderRule.headers.some((header) => header.key === 'X-Robots-Tag' && header.value === 'noindex, follow'),
    'expected noindex robots header on http www responses'
  );
});
