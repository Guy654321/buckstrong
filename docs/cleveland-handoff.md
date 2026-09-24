# Cleveland expansion handoff

## Result and architecture

Buck Strong is an Astro 4 site deployed with the Vercel serverless adapter. Location JSON in `src/content/locations` feeds the shared `/locations/[slug]` page, breadcrumbs, schema, navigation, footer, and sitemap path builder. Core market service pages use the existing `/[city]-oh/[service]` components. The build generates `sitemap.xml` and `sitemap-0.xml`; an Astro route generates `robots.txt`, and `public/llms.txt` is maintained directly. There is no `llms-full.txt` or hreflang system. This handoff is for the Cleveland review branch based on current GitHub `main`; it retains the newer Brevo contact endpoint and `www` canonical host.

The Cleveland hub is `https://www.buckstronggaragedoors.com/locations/cleveland`. This expansion adds **55 location pages** to the prior 15, making **70 Cleveland location pages** plus **four core Cleveland service pages**: **74 indexable Cleveland URLs**. New locations are stored in the same collection and can be used for future service × location content. Suburb-specific service pages were deliberately not generated in this release because they would duplicate the four market services without distinct service content.

Review preview: `https://buckstrong-hre1v453v-guy654321s-projects.vercel.app/locations/cleveland`. The Vercel preview is protected, so reviewers may need to sign in. Its `noindex` response header is intentional for previews; generated page metadata and sitemap use the production canonical host.

The complete place, county, population, ZIP, and selection table is in [cleveland-service-area.md](./cleveland-service-area.md). The selected territory has **63 representative ZIP codes**. The dedicated booking line is **(216) 930-2980**, open 24/7 for calls. The owner-supplied Cleveland-market address at **24500 Center Ridge Rd, Ste. 275-1, Westlake, OH 44145** appears in the hub, contact page, footer, and structured data. The hub and suburb records connect through nearby-location relationships, while the footer features a manageable set of Cleveland areas and links to the complete hub list.

## SEO and content checks

- All 74 Cleveland URLs occur in the generated sitemap. Each has a self canonical, unique title, description, and H1, valid JSON-LD, and an internal link path. No page has an accidental noindex directive.
- The Cleveland hub uses LocalBusiness schema with the owner-supplied Westlake address and 24/7 opening-hours specification. City pages use Service schema with a reference to the Cleveland business; township pages identify an AdministrativeArea, and Cleveland neighborhood pages identify a Place contained within Cleveland. BreadcrumbList follows the market hierarchy. The Cleveland phone is used in local schema and calls to action.
- Every location has a distinct local heading, introduction, issue discussion, and homeowner advice. The 69 suburb/neighborhood local-copy sets have a minimum of 66 words and a maximum pairwise eight-word-shingle similarity of 5.1%. Whole rendered pages share up to 60.1% of eight-word shingles because they reuse the same service, process, and conversion template. The shared material is visible and useful; it is not hidden SEO filler.
- The final crawl found 0 broken internal links, malformed schema blocks, duplicate metadata/H1s/canonicals, missing sitemap pages, orphan pages, or unintentional Cincinnati contact details in the Cleveland main content. The global call chooser and footer still show Cincinnati as a separate market.
- Cleveland hero descriptions now follow the existing hero presentation with complete service explanations and clear booking expectations. The four market service heroes use natural “Cleveland, OH and nearby communities” wording. The shared Cincinnati hero copy and visual styles were left unchanged.
- `public/llms.txt` links the Cleveland hub and four core services. The existing sitemap and robots generators picked up the new records; no generated sitemap was edited by hand.

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | Passed; 1,653 HTML files overall, exactly 74 Cleveland pages |
| `npm run lint` / Astro type check | Passed; 0 errors, 0 warnings, 18 unused-variable hints |
| `npm test` | 33 passed, 0 failed |
| `npm run validate-sitemap` | 1,317 / 1,317 URLs valid; canonical and robots checks passed |
| `npm run check:orphaned` | Passed |
| Cleveland crawl | 74 URLs, 0 issues |
| Cleveland static link crawl on current-main build | 74 generated pages, 11,296 internal link instances, 0 broken targets |

### Cleveland form QA

- Audited all 74 generated Cleveland pages: each contains the shared page quote form, required fields, loader hook, and `/api/contact` action.
- Submitted the hub, West Park, and Cleveland repair forms in a mobile browser through the local Astro API to a temporary local webhook. All three showed success, reset fields, and delivered the correct source URL, ZIP, issue, and consent value. No live lead destination was used.
- An empty form was blocked by browser required-field validation. A simulated delivery failure displayed the returned error, retained the entered values, and re-enabled Submit.
- The current-main-based Vercel preview retains Brevo delivery. One clearly labeled test lead was submitted from the Cleveland hub preview; the form showed the success state and reset its fields. No additional live test leads were sent.

Lighthouse 13.4.1 on the locally served current-main production build. The compressed local preview approximates transfer compression; these are local scores, not Vercel deployment scores. The repair service Performance score varied from 98 to 99 on repeated mobile runs.

| Page / device | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Cleveland hub / desktop | 100 | 100 | 100 | 100 |
| Cleveland hub / mobile | 100 | 100 | 100 | 100 |
| West Park / mobile | 100 | 100 | 100 | 100 |
| Cleveland repair service / mobile, latest run | 99 | 100 | 100 | 100 |

The newer main branch already includes updated consent and tracking behavior. Mobile Performance varied under Lighthouse throttling. The hero now preloads only AVIF instead of downloading AVIF, WebP, and JPEG together; format fallbacks remain in the picture element. A responsive repair hero image improved its mobile Performance score. Desktop, tablet, and mobile spot checks found no horizontal overflow or broken booking links; the checked Cleveland calls use the 216 line. All four Cleveland service pages scored 100 Accessibility in separate Lighthouse checks.

## Manual action

1. Confirm whether **24500 Center Ridge Rd, Ste. 275-1, Westlake, OH 44145** accepts walk-ins. It is published as the Cleveland-market address, without a walk-in office claim.
2. Confirm operational coverage by street address for the outer edges, especially Amherst, Lorain, Painesville, Chardon, Medina, Streetsboro, and Aurora. Copy intentionally asks customers to confirm availability.
3. Review the Vercel preview and pull request. Merge only after approval; production deployment follows the repository's normal Vercel workflow. Submit the sitemap in Google Search Console after production deployment. Search Console does not have a numeric 100 score. The preview is protected and carries a Vercel `noindex` header; production indexability requires the eventual production deployment.
4. Plan the Vercel Node.js 20 runtime migration. The platform warns that Node.js 20 is deprecated after October 1, 2026; this requires a separate compatibility check of the Astro/Vercel adapter and `scripts/enforce-vercel-runtime.mjs` before future production builds.

No existing Cincinnati location content or URL generation was intentionally changed. Shared layout text, navigation links, footer links, and accessibility behavior were changed only to support Cleveland. The Cleveland branch and protected Vercel preview are available for review; production was not deployed.

## Files edited in this expansion

- `docs/cleveland-service-area.md` and this handoff.
- `src/content/locations/cleveland.json` and all 69 JSON records in `src/content/locations/cleveland/` (55 new; 14 existing records gained nearby links).
- `src/content/config.ts`, `src/lib/locations.ts`, and `src/pages/locations/[slug]/index.astro` for neighborhood/township schema and market-aware copy/linking.
- `src/components/Footer.astro` for a concise featured Cleveland list and correct Cleveland Organization contact data.
- `public/llms.txt` for Cleveland discovery links.
- `src/pages/contact.astro` and `src/layouts/Base.astro` for the public Cleveland-market address, booking hours, and correct Open Graph address metadata.
- The four shared core service-page components for Cleveland provider address and hours schema, plus `src/lib/location-routing.ts` to keep market names independent of postal address locality.
- `src/components/BrandLogo.astro` and `public/images/ohio-logo-nav.webp` for the same navigation logo at a smaller transfer size; `src/scripts/speed-insights-loader.js` avoids a local-only missing deployment endpoint.
- `src/components/Hero.astro` preloads only the preferred image format, retaining WebP/JPEG picture fallbacks.
