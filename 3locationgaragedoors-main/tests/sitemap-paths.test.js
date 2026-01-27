import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildHubServicePaths, buildSitemapPathCandidates } from '../src/utils/sitemap-paths.js';

test('buildHubServicePaths creates all hub and service combinations', () => {
  const hubs = [
    { slug: 'louisville' },
    { slug: 'lexington' },
  ];
  const services = [
    { slug: 'garage-door-repair' },
    { slug: 'commercial-jobs' },
  ];

  const result = buildHubServicePaths(hubs, services);

  const expected = [
    '/locations/louisville/services/garage-door-repair',
    '/locations/louisville/services/commercial-jobs',
    '/locations/lexington/services/garage-door-repair',
    '/locations/lexington/services/commercial-jobs',
  ];

  assert.deepEqual(result.sort(), expected.sort());
});

test('buildSitemapPathCandidates includes hub service URLs without duplicating suburbs', () => {
  const staticRoutes = ['/', '/locations'];
  const dynamicServiceSlugs = [];
  const services = [
    { slug: 'garage-door-repair' },
    { slug: 'opener-repair' },
    { slug: 'commercial-jobs' },
  ];
  const locations = [
    { slug: 'louisville', isHub: true },
    { slug: 'lexington', isHub: true },
    { slug: 'nicholasville', isHub: false },
  ];
  const blogPosts = [{ slug: 'seasonal-garage-maintenance' }];

  const result = buildSitemapPathCandidates({
    staticRoutes,
    dynamicServiceSlugs,
    services,
    locations,
    blogPosts,
  });

  assert(result.includes('/'));
  assert(result.includes('/locations'));
  assert(result.includes('/services/garage-door-repair'));
  assert(result.includes('/services/opener-repair'));
  assert(result.includes('/services/commercial-jobs'));
  assert(result.includes('/locations/louisville'));
  assert(result.includes('/locations/lexington'));
  assert(result.includes('/locations/nicholasville'));
  assert(result.includes('/locations/louisville/services/garage-door-repair'));
  assert(result.includes('/locations/lexington/services/commercial-jobs'));
  assert(!result.includes('/locations/nicholasville/services/garage-door-repair'));
  assert(result.includes('/blog/seasonal-garage-maintenance'));
});
