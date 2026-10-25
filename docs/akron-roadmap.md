# Akron hub roadmap — 23 October 2026

## Architecture review and scope

Current GitHub main is e0c7204, including the Cleveland expansion and both desktop navigation fixes. The older dirty primary checkout is preserved. Akron work is isolated on `codex/akron-market-hub`.

Astro content-collection JSON drives `/locations/[slug]`, maps, location relationships, the directory, and hub navigation. Four shared components generate `/[city]-oh/{garage-door-repair,opener-repair,garage-door-installation,commercial-jobs}`. Cleveland subsequently gained 21 repair, opener, door-material, and commercial detail routes for every suburb. Its dedicated detail component owns the existing alternating section layout and quote form. Routing, sitemap generation, business schema, and several components still contain Cleveland-specific branches; extend those branches for Akron rather than cloning page templates.

Carry forward: city and OH in headings; complete professional hero copy; each locality links to its own core services and detail pages; local breadcrumbs and provider address; one instance of each section; alternating backgrounds; validated quote forms; self canonicals on the www production origin; no fabricated office addresses or review ratings; no shared-service redirect back to another market. Retain current navigation styling, tracking, consent, form endpoint, typography, images, spacing, and components.

## Research and territory decision

See `akron-service-area.md` and the source-backed selection in `research/akron-selection.json`. Publish one hub, 29 distinct surrounding communities, and six recognized Akron residential neighborhoods. All selected community centers are under 16 straight-line miles from central Akron; actual drive distance and scheduling vary. The operating shape follows the Akron urban/suburban corridors rather than claiming every address in a circle.

Do not add or move any existing Cleveland locality. Reserve northern transition areas Richfield, Peninsula, Boston Heights, and the Hudson/Twinsburg corridor to Cleveland for this release. Medina city, Brunswick, Aurora, and Streetsboro also remain Cleveland. Do not create duplicate Portage Lakes, Manchester, Montrose-Ghent, Lake Township, or Ravenna Township pages alongside the selected municipalities/townships. Their relevant addresses can be assessed through the existing selected pages. Canton, Massillon, Wooster, Alliance, and farther rural areas are deferred rather than implying a second regional territory.

## Implementation sequence

1. Save the territory, sources, housing screening, representative ZIPs, exclusions, and market boundary before page creation.
2. Add Akron hub and local records to the existing collection. Use the supplied market address: 66 South Miller Road, Suite LL3, Akron, OH 44333. Describe it as a market address, with no claim of a staffed walk-in office. Some property references use Fairlawn as the municipality; preserve the owner's supplied Akron postal address and do not claim a downtown Akron office.
3. Extend shared routing and service/detail templates for Akron. Reuse existing layouts and styling. All 36 locations receive four core service pages and the same 21 detail types; every card, related-service link, breadcrumb, and canonical keeps its locality.
4. Add Akron to existing market navigation, footer hub links, location directory, and contact-location cards. The owner subsequently approved adding Akron to shared homepage, FAQ, and general-service wording where markets are listed. Extend those existing lists and service links; retain their classes, structure, and layout. Do not rewrite other markets.
5. Extend underlying sitemap and discovery sources, retaining current robots behavior. The repository has llms.txt, no llms-full.txt or hreflang system; do not invent new discovery files.
6. Run build/lint/type checks, tests, sitemap/orphan audits, a complete Akron link/schema/metadata crawl, section/duplicate checks, browser QA at desktop/tablet/mobile widths, local form delivery against a test destination, and representative Lighthouse checks. Inspect representative Cleveland and Cincinnati output for regressions.

## Phone and launch gate

The phone was intentionally unset during initial development. The owner subsequently supplied **(234) 231-6525**, now stored in the Akron hub and inherited by all children. The existing call chooser includes Akron from that same source. Akron operating/booking hours remain unconfirmed, so no 24/7 claim is assigned to the Akron business. Existing Cincinnati/Cleveland call hours are retained. Do not claim that Google has indexed a page: sitemap presence and technical indexability are verifiable; actual indexing needs post-launch Search Console inspection.

No production deployment or merge is included in this work. Vercel retired new Node 20 deployments on 1 October 2026. The owner subsequently authorized a minimum runtime upgrade; package/lock engines and the existing function-runtime enforcement step now target Node 24, with Astro and dependency versions retained. Verify the clean build and built handler under Node 24 before deployment.
