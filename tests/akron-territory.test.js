import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildLocationServicePaths } from '../src/utils/sitemap-paths.js';

const hub = JSON.parse(fs.readFileSync('src/content/locations/akron.json'));
const read = folder => fs.readdirSync(folder).filter(file => file.endsWith('.json')).map(file => JSON.parse(fs.readFileSync(`${folder}/${file}`)));
const akron = [hub, ...read('src/content/locations/akron')];
const cleveland = [JSON.parse(fs.readFileSync('src/content/locations/cleveland.json')), ...read('src/content/locations/cleveland')];

test('Akron territory does not duplicate Cleveland places or representative ZIPs', () => {
  const existing = new Set(cleveland.map(location => location.name.toLowerCase()));
  const zipSet = new Set(cleveland.flatMap(location => location.zips ?? []));
  assert.equal(akron.length, 36);
  for (const location of akron) {
    assert.ok(!existing.has(location.name.toLowerCase()), location.name);
    assert.ok(location.zips.every(zip => !zipSet.has(zip)), `${location.name}: ZIP overlap`);
    assert.ok(location.surroundingAreas.every(name => akron.some(candidate => candidate.name === name)), `${location.name}: wrong market relationship`);
  }
});

test('Akron service routes retain each locality for all four service families', () => {
  const families = ['garage-door-repair','opener-repair','garage-door-installation','commercial-jobs','garage-door-spring-replacement','garage-door-opener-belt-drive-repair','garage-door-steel-garage-doors','garage-door-commercial-retail-municipal-garage-door-service'];
  const paths = buildLocationServicePaths(akron, families.map(slug => ({ slug })));
  assert.equal(new Set(paths).size, akron.length * families.length);
  for (const location of akron) for (const service of families) {
    assert.ok(paths.includes(`/${location.slug.replace(/^akron-/, '')}-oh/${service}`));
  }
});

test('Only the Akron hub owns the supplied physical address; no other market phone is assigned', () => {
  assert.equal(hub.address.streetAddress, '66 South Miller Road, Suite LL3');
  assert.equal(hub.address.postalCode, '44333');
  for (const location of akron.slice(1)) {
    assert.equal(location.parentHub, 'akron');
    assert.equal(location.address, undefined);
    assert.ok(!/216|513/.test(location.phone));
  }
});
