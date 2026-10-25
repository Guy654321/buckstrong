# Akron expansion handoff

Status: implemented and verified locally on `codex/akron-market-hub`, based on GitHub main `e0c7204`. The older dirty primary checkout is preserved. Source checkout: `/tmp/buckstrong-akron-market`. The verified changes are prepared for GitHub review on this branch. Production has not been changed.

## Scope and architecture

The Cincinnati and Cleveland review is documented in [the roadmap](akron-roadmap.md). Akron extends the same Astro location collection, canonical routing helpers, four service templates, existing Cleveland detail template, map component, navigation, contact form, and generated sitemap system. The existing design, typography, breakpoints, tracking, API, consent, and component system are retained. QA fixes remove duplicate floating call controls, allow the footer email to wrap at 320px, and add a quote-anchor scroll offset so the sticky header does not cover the form. The contact page also receives a semantic main landmark, a matching accessible call-button name, and sufficient contrast on its existing section label. These are targeted usability/accessibility fixes; compiled stylesheets remain byte-identical to the baseline. The owner explicitly approved adding Akron to shared market lists and subsequently approved the minimum project-wide runtime upgrade.

- Hub: `/locations/akron`.
- Local location format: `/locations/akron-{locality}`.
- Core service format: `/{locality}-oh/{service}`.
- Detail format: `/{locality}-oh/garage-door-{detail}` (existing opener/commercial prefixes retained).
- 36 locations: Akron hub, 29 surrounding communities, six Akron neighborhoods.
- 936 canonical new URLs: 36 location pages + 144 core service pages + 756 detail pages.
- All 36 locations retain their own 25 core/detail service routes across repair, opener, installation, and commercial groups.

## Territory and ZIPs

See [the service-area research](akron-service-area.md) for the complete housing/population table, ZIP mappings, sources, exclusions, boundary assumptions, and Census provenance. Existing Cleveland localities retain their market ownership; none of their locality names or representative ZIPs was added to Akron. Postal codes do not define municipal or dispatch boundaries. Nearby communities were selected for practical routes and distinct residential scale, not every point in a radius. More distant Canton, Massillon, Wooster, Alliance, and rural expansion are deferred.

Locations: Akron, Barberton, Bath Township, Brimfield Township, Canal Fulton, Copley Township, Coventry Township, Cuyahoga Falls, Doylestown, Ellet, Fairlawn, Firestone Park, Goodyear Heights, Green, Hartville, Jackson Township, Kenmore, Kent, Lakemore, Mogadore, Munroe Falls, New Franklin, North Canton, Northwest Akron, Norton, Ravenna, Rittman, Rootstown Township, Silver Lake, Springfield Township, Stow, Suffield Township, Tallmadge, Uniontown, Wadsworth, Wallhaven.

Representative territory ZIPs: 44203, 44216, 44221, 44223, 44224, 44230, 44240, 44250, 44260, 44262, 44266, 44270, 44272, 44278, 44281, 44301, 44302, 44303, 44304, 44305, 44306, 44307, 44308, 44310, 44311, 44312, 44313, 44314, 44319, 44321, 44333, 44614, 44632, 44646, 44685, 44718, 44720.

## Business information and schema

Owner-supplied market address: **66 South Miller Road, Suite LL3, Akron, OH 44333**. It appears in public Akron copy, the footer, contact card/map, provider schema, and metadata. Map results may identify Fairlawn as the municipality; the supplied Akron postal address is preserved. Municipal/neighborhood center coordinates describe service areas and are not published as physical-office coordinates. No suburb receives a fake office address or local review aggregate.

The hub uses LocalBusiness; locality pages use Service with the Akron provider; core/detail pages retain Service and BreadcrumbList. Townships use AdministrativeArea, neighborhoods use Place contained in Akron, and Uniontown uses Place contained in Lake Township, Stark County. Akron geographic postal fields are nested in PostalAddress, and areaServed uses supported place types. Contact Organization schema includes all three real supplied addresses. No Cincinnati hidden SEO helper is included on Akron pages.

Akron's owner-supplied phone is **(234) 231-6525** (`tel:2342316525`). It is stored in the hub and inherited by the 35 child locations, all service/detail providers, page call actions, contact/footer entries, and the global call chooser. Metadata and llms.txt include the number. Shared Services-menu descriptions now cover the service generally; Akron image descriptions do not imply reused stock/example photos show completed local jobs. There is one floating call control per Akron page. Akron hours remain unconfirmed, so no 24/7 hours are assigned to its schema. Existing Cincinnati/Cleveland call hours remain unchanged.

## Links, discovery, and indexability

Akron is integrated into existing navigation, footer, directory, contact cards, homepage market links, FAQ, shared service cards, and general-service detail links. Local overviews link to their own detail pages and back to their locality and hub. There is one instance of each section and alternating backgrounds through the Akron templates.

The sitemap sources generate **3,999 canonical URLs**, including all 936 new Akron URLs. Generated sitemap.xml and sitemap index are validated; the existing robots route and www canonical-host redirects are retained. llms.txt is updated at its source. There is no existing llms-full or hreflang system, and none was invented. Akron pages have self canonicals, one H1, unique metadata, valid JSON-LD, no accidental noindex, and internal inbound links. Google indexing itself can only be checked after publication in Search Console.

## Verification

- Build/type checking: passed under Node 24.22.1, zero errors or warnings; 16 existing diagnostic hints.
- Tests: 38 passed, zero failed.
- Sitemap: all 3,999 URLs valid; robots references the generated sitemap.
- Akron crawl: 936 pages, 183,943 internal link occurrences, 11,196 local asset references, and 2,988 JSON-LD blocks checked; zero reported issues.
- No repeated H2 sections or exact duplicate main content after normalizing locality names. Equipment guidance is intentionally shared by service type; each locality has distinct homeowner and commercial notes.
- Browser checks: all 936 Akron URLs visited at 390px. Two transient logo-loading flags passed individual rechecks. An additional 152 checks across 38 representative routes at 320, 390, 840, and 1280px found zero overflow, broken images, or duplicate floating controls. Desktop/tablet navigation, mobile menu, three-market call chooser, local service links, and quote-anchor clearance were checked. All Akron template families and the contact page alternate white/muted content sections. The contact map loaded the supplied South Miller Road address with the correct phone displayed. Reports retain the original 320px footer flags and their successful rechecks.
- Existing-market comparison: 2,225 existing market pages have unchanged main text; compiled stylesheets are byte-identical to the Cleveland baseline. Approved shared market lists changed.
- Forms: hub and all four detail families passed browser → built Vercel API under Node 24 → isolated local receiver → success/reset checks. Existing Cincinnati and Cleveland hub forms passed the same flow. Payloads retained source URL, ZIP, issue, and consent. The final contact-page submission also passed with ZIP 44333, success feedback, cleared fields, and an enabled submit button. Required-field blocking and a simulated receiver failure were verified; failed submissions retain entered values and allow retry. Click-to-call links use tel:2342316525, but no carrier or incoming-call test was performed. Live email/CRM delivery and production Turnstile require environment-specific post-deployment checks; no synthetic lead was sent to production recipients.
- Lighthouse 12.8.2, eight representative audits: SEO, Accessibility, and Best Practices all 100. Performance 97–100. The contact page initially scored 96 for accessibility; the label contrast and call-button accessible name were corrected and the page was re-audited. See `reports/akron-lighthouse.json` for each result; scores are local measurements, not promises for every URL or real-user connection.

## Runtime upgrade

The owner approved changing the Node 20 deployment pins to Node 24. `package.json`, the root lockfile engine, and `scripts/enforce-vercel-runtime.mjs` now target 24. Dependencies and Astro/adapter versions are unchanged. A clean lockfile install, build, tests, and crawl pass under Node 24.22.1. The old adapter emits a stale Node-24 support warning and first generates its old fallback; the existing runtime enforcement step sets the final Vercel function to `nodejs24.x`. The built handler passed seven browser form deliveries under Node 24, including Akron and the existing Cincinnati/Cleveland hubs. A simulated delivery failure preserved the fields, showed the error, and re-enabled submit. See `reports/akron-node24-forms.json`.

[Vercel’s Node 20 retirement notice](https://vercel.com/changelog/node-js-20-is-being-deprecated) explains why this change is necessary for new deployments. Existing deployments are unaffected by this local change. The lockfile install reports 45 existing dependency advisories; resolving them would require a separate dependency/framework maintenance scope.

## Remaining launch actions

1. Make a real incoming test call to (234) 231-6525 and confirm Akron operating/booking hours before adding any 24/7 claim to public copy or schema. The supplied phone is already integrated.
2. Review the selected territory against actual staffing and dispatch capacity.
3. Review the published Vercel preview at https://buckstrong-pqfnwd5ww-guy654321s-projects.vercel.app/locations/akron. It is READY; the build passed in 325 seconds. Representative remote pages returned HTTP 200, all 936 Akron URLs appear in both sitemap sources, robots/llms load, and runtime logs confirm nodejs24.x. Preview responses carry noindex as expected. The public Turnstile widget is not enabled in this preview; live recipient/CRM delivery was not tested. Browser visual access was declined, so no deployed screenshot was captured. The preview was created from the verified working tree before the GitHub push; production has not changed. See reports/akron-vercel-deployment.json. A production release and environment-specific live checks remain separate launch steps.
4. After launch, submit or refresh the sitemap in Search Console and inspect representative Akron URLs. No Search Console score or indexing guarantee is claimed.

## Commands

Run with Node 24:

```sh
npm ci
npm run build
npm test
npm run check:akron
npm run validate-sitemap
```

`npm run build` includes Astro type checks, minification, runtime enforcement, orphan detection, and existing Cleveland detail checks. The minifier rewrites `public/scripts/nearby-toggle.js` as a generated artifact; its tracked source content is restored after QA to avoid an unrelated source change.

## Changed files

- `docs/akron-handoff.md`
- `docs/akron-roadmap.md`
- `docs/akron-service-area.md`
- `docs/research/akron-housing-acs2024.json`
- `docs/research/akron-neighborhood-geocoding.json`
- `docs/research/akron-selection.json`
- `docs/research/ohio-places-gazetteer2024.txt`
- `docs/research/ohio-townships-gazetteer2024.txt`
- `package-lock.json`
- `package.json`
- `public/llms.txt`
- `reports/akron-all-mobile-ui.json`
- `reports/akron-audit.json`
- `reports/akron-contact-final-ui.json`
- `reports/akron-final-contact-form.json`
- `reports/akron-lighthouse.json`
- `reports/akron-node24-form-error.json`
- `reports/akron-node24-form-ui.json`
- `reports/akron-node24-forms.json`
- `reports/akron-other-screen-ui.json`
- `reports/akron-qa-summary.json`
- `reports/akron-regression-content.json`
- `reports/akron-release-ui.json`
- `reports/akron-responsive.json`
- `reports/akron-section-backgrounds.json`
- `reports/akron-ui-routes.json`
- `reports/akron-vercel-deployment.json`
- `reports/screenshots/akron-call-chooser-mobile.jpg`
- `reports/screenshots/akron-contact-map.jpg`
- `reports/screenshots/akron-contact-teams-desktop.jpg`
- `reports/screenshots/akron-desktop.jpg`
- `reports/screenshots/akron-mobile.jpg`
- `scripts/check-akron-pages.mjs`
- `scripts/enforce-vercel-runtime.mjs`
- `src/components/ContactForm.astro`
- `src/components/Footer.astro`
- `src/components/Hero.astro`
- `src/components/IconRow.astro`
- `src/components/LocationMap.astro`
- `src/components/Nav.astro`
- `src/components/ServiceCard.astro`
- `src/components/service-pages/ClevelandServiceDetailPage.astro`
- `src/components/service-pages/CommercialJobsPage.astro`
- `src/components/service-pages/GarageDoorInstallationPage.astro`
- `src/components/service-pages/GarageDoorRepairPage.astro`
- `src/components/service-pages/OpenerRepairPage.astro`
- `src/components/service-pages/ServiceInternalLinks.astro`
- `src/content/config.ts`
- `src/content/locations/akron.json`
- `src/content/locations/akron/akron-barberton.json`
- `src/content/locations/akron/akron-bath-township.json`
- `src/content/locations/akron/akron-brimfield-township.json`
- `src/content/locations/akron/akron-canal-fulton.json`
- `src/content/locations/akron/akron-copley-township.json`
- `src/content/locations/akron/akron-coventry-township.json`
- `src/content/locations/akron/akron-cuyahoga-falls.json`
- `src/content/locations/akron/akron-doylestown.json`
- `src/content/locations/akron/akron-ellet.json`
- `src/content/locations/akron/akron-fairlawn.json`
- `src/content/locations/akron/akron-firestone-park.json`
- `src/content/locations/akron/akron-goodyear-heights.json`
- `src/content/locations/akron/akron-green.json`
- `src/content/locations/akron/akron-hartville.json`
- `src/content/locations/akron/akron-jackson-township.json`
- `src/content/locations/akron/akron-kenmore.json`
- `src/content/locations/akron/akron-kent.json`
- `src/content/locations/akron/akron-lakemore.json`
- `src/content/locations/akron/akron-mogadore.json`
- `src/content/locations/akron/akron-munroe-falls.json`
- `src/content/locations/akron/akron-new-franklin.json`
- `src/content/locations/akron/akron-north-canton.json`
- `src/content/locations/akron/akron-northwest-akron.json`
- `src/content/locations/akron/akron-norton.json`
- `src/content/locations/akron/akron-ravenna.json`
- `src/content/locations/akron/akron-rittman.json`
- `src/content/locations/akron/akron-rootstown-township.json`
- `src/content/locations/akron/akron-silver-lake.json`
- `src/content/locations/akron/akron-springfield-township.json`
- `src/content/locations/akron/akron-stow.json`
- `src/content/locations/akron/akron-suffield-township.json`
- `src/content/locations/akron/akron-tallmadge.json`
- `src/content/locations/akron/akron-uniontown.json`
- `src/content/locations/akron/akron-wadsworth.json`
- `src/content/locations/akron/akron-wallhaven.json`
- `src/data/akron-service-details.ts`
- `src/data/call-markets.ts`
- `src/data/locations.ts`
- `src/layouts/Base.astro`
- `src/lib/canonical.ts`
- `src/lib/location-routing.ts`
- `src/lib/locations.ts`
- `src/pages/404.astro`
- `src/pages/[city]-oh/garage-door-[service].astro`
- `src/pages/blog/index.astro`
- `src/pages/contact.astro`
- `src/pages/faq.astro`
- `src/pages/index.astro`
- `src/pages/locations/[slug]/index.astro`
- `src/pages/locations/index.astro`
- `src/pages/privacy-policy.astro`
- `src/pages/safety.astro`
- `src/pages/services/index.astro`
- `src/pages/sitemap.xml.ts`
- `src/utils/sitemap-paths.js`
- `src/utils/sitemap-utils.js`
- `tests/akron-territory.test.js`
