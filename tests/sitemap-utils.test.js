import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { shouldExcludePage, validateSitemapUrls } from '../src/utils/sitemap-utils.js';

describe('shouldExcludePage', () => {
  it('handles relative paths without throwing', () => {
    assert.strictEqual(shouldExcludePage('/admin/dashboard/'), true);
    assert.strictEqual(shouldExcludePage('admin/dashboard/'), true);
    assert.strictEqual(shouldExcludePage('/services/garage-door-repair/'), false);
  });
});

describe('validateSitemapUrls', () => {
  it('flags non-HTTPS URLs with a warning', () => {
    const urls = [
      { url: 'http://example.com/page-1' },
      { url: 'https://example.com/page-2' }
    ];

    const result = validateSitemapUrls(urls);

    assert.strictEqual(result.warnings.length, 1);
    assert.match(result.warnings[0], /Not using HTTPS/);
  });

  it('reports errors when priority values are outside 0-1 range', () => {
    const urls = [
      { url: 'https://example.com/low-priority', priority: -0.1 },
      { url: 'https://example.com/high-priority', priority: 1.5 }
    ];

    const result = validateSitemapUrls(urls);

    assert.strictEqual(result.errors.length, 2);
    assert.match(result.errors[0], /Invalid priority value/);
    assert.match(result.errors[1], /Invalid priority value/);
  });

  it('reports errors for invalid changefreq values', () => {
    const urls = [
      { url: 'https://example.com/sometimes', changefreq: 'sometimes' }
    ];

    const result = validateSitemapUrls(urls);

    assert.strictEqual(result.errors.length, 1);
    assert.match(result.errors[0], /Invalid changefreq/);
  });

  it('warns when canonical tags are missing from HTML snapshots', () => {
    const urls = [{ url: 'https://example.com/missing/' }];

    const result = validateSitemapUrls(urls, {
      siteOrigin: 'https://example.com',
      getSnapshot: () => ({
        type: 'html',
        content: '<html><head><title>Missing Canonical</title></head><body></body></html>'
      })
    });

    assert.ok(result.warnings.some(message => message.includes('Missing canonical link tag')));
  });

  it('detects duplicate canonical URLs across audited pages', () => {
    const urls = [
      { url: 'https://example.com/first/' },
      { url: 'https://example.com/second/' }
    ];

    const snapshots = {
      '/first/': '<link rel="canonical" href="https://example.com/shared" />',
      '/second/': '<link rel="canonical" href="https://example.com/shared/" />'
    };

    const result = validateSitemapUrls(urls, {
      siteOrigin: 'https://example.com',
      getSnapshot: meta => ({
        type: 'html',
        content: `<html><head>${snapshots[meta.pathname]}</head><body></body></html>`
      })
    });

    assert.ok(result.warnings.some(message => message.includes('Duplicate canonical detected (https://example.com/shared)')));
  });

  it('reads canonical hints from JSON snapshots', () => {
    const urls = [{ url: 'https://example.com/json-page/' }];

    const result = validateSitemapUrls(urls, {
      siteOrigin: 'https://example.com',
      getSnapshot: () => ({
        type: 'json',
        content: JSON.stringify({ slug: 'json-page', canonical: 'https://example.com/json-page/' })
      })
    });

    assert.ok(!result.warnings.some(message => message.includes('Missing canonical')));
    assert.ok(result.audits[0].slugHints.includes('json-page'));
  });
});
