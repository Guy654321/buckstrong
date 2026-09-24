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
  const locationServiceSlugs = [
    'garage-door-repair',
    'opener-repair',
    'commercial-jobs',
    'garage-door-spring-replacement',
  ];
  const blogPosts = [{ slug: 'seasonal-garage-maintenance' }];

  const result = buildSitemapPathCandidates({
    staticRoutes,
    dynamicServiceSlugs,
    services,
    locationServiceSlugs,
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
  assert(result.includes('/nicholasville-oh/garage-door-spring-replacement'));
  assert(result.includes('/blog/seasonal-garage-maintenance'));
});

test('Cleveland suburbs receive location URLs without duplicate service pages', () => {
  const locations = [
    { slug: 'cincinnati-mason', isHub: false },
    { slug: 'cleveland', isHub: true },
    { slug: 'cleveland-westlake', isHub: false },
  ];
  const services = [{ slug: 'garage-door-repair' }];
  const paths = buildSitemapPathCandidates({ locations, services });

  assert(paths.includes('/locations/cleveland-westlake'));
  assert(paths.includes('/cleveland-oh/garage-door-repair'));
  assert(paths.includes('/mason-oh/garage-door-repair'));
  assert(!paths.includes('/westlake-oh/garage-door-repair'));
});

test('Cleveland sitemap includes only published market service pages', () => {
  const paths = buildLocationServicePaths(
    [{ slug: 'cleveland', isHub: true }],
    [
      { slug: 'garage-door-repair' },
      { slug: 'opener-repair' },
      { slug: 'garage-door-installation' },
      { slug: 'commercial-jobs' },
      { slug: 'garage-door-spring-replacement' },
    ],
  );

  assert.deepEqual(paths.sort(), [
    '/cleveland-oh/garage-door-repair',
    '/cleveland-oh/opener-repair',
    '/cleveland-oh/garage-door-installation',
    '/cleveland-oh/commercial-jobs',
  ].sort());
  assert(!paths.includes('/cleveland-oh/garage-door-spring-replacement'));
});
