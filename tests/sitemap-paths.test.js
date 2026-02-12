import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLocationServicePaths, buildSitemapPathCandidates } from '../src/utils/sitemap-paths.js';

test('buildLocationServicePaths creates all location and service combinations', () => {
  const locations = [
    { slug: 'louisville' },
    { slug: 'lexington' },
  ];
  const services = [
    { slug: 'garage-door-repair' },
    { slug: 'commercial-jobs' },
  ];

  const result = buildLocationServicePaths(locations, services);

  const expected = [
    '/louisville-oh/garage-door-repair',
    '/louisville-oh/commercial-jobs',
    '/lexington-oh/garage-door-repair',
    '/lexington-oh/commercial-jobs',
  ];

  assert.deepEqual(result.sort(), expected.sort());
});

test('buildSitemapPathCandidates includes location service URLs for all locations', () => {
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
  assert(result.includes('/louisville-oh/garage-door-repair'));
  assert(result.includes('/lexington-oh/commercial-jobs'));
  assert(result.includes('/nicholasville-oh/garage-door-repair'));
  assert(result.includes('/blog/seasonal-garage-maintenance'));
});
