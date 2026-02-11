import type { ImageMetadata } from 'astro';
import warehouseHeroImage from '../assets/images/commercial/storage-warehouse-2089775_1280.jpg';
import dockHeroImage from '../assets/images/commercial/dock-service-maintenance.jpg';
import storefrontHeroImage from '../assets/images/commercial/retail-storefront-service.jpg';

export type CommercialServiceSlug =
  | 'warehouse-distribution-door-service'
  | 'dock-industrial-door-equipment-service'
  | 'retail-municipal-garage-door-service';

export type CommercialServicePage = {
  slug: CommercialServiceSlug;
  serviceName: string;
  cardTitle: string;
  intro: string;
  details: string[];
  signs: string[];
  processSteps: string[];
  options: string[];
  optionsSummary: string;
  whyChoose: string;
  areaSummary: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: ImageMetadata;
  heroAlt: string;
  relatedSlugs: CommercialServiceSlug[];
};

export const COMMERCIAL_SERVICE_PAGES: CommercialServicePage[] = [
  {
    slug: 'warehouse-distribution-door-service',
    serviceName: 'Warehouse & Distribution Door Service',
    cardTitle: 'Warehouses & Distribution',
    intro:
      'Warehouse and distribution facilities need commercial doors that cycle reliably through long shifts, heavy traffic, and changing weather in Cincinnati, OH. Our warehouse and distribution door service covers sectional doors, rolling steel systems, high-cycle tracks, and loading-bay access points with safety-first execution. We support owner-operators, regional logistics teams, and national fleet clients that need predictable uptime and clear documentation. If your crew has dealt with repeated failures, we can stabilize operations quickly with local garage door service Cincinnati OH businesses trust.',
    details: [
      'Commercial environments require more than basic fixes. We evaluate duty cycle, spring life expectations, drum wear, opener force settings, and track condition so your doors are matched to real throughput demands instead of temporary patch repairs. This approach helps reduce costly delays during receiving, outbound shipping, and overnight staging.',
      'We also help facilities compare replacement-ready options when older systems are no longer cost-effective. From insulated panel upgrades to reinforced wind-load-rated configurations, we guide decisions based on your building envelope, dock flow, and security priorities. For urgent outages, ask about emergency garage door repair Cincinnati dispatch to secure your bays and resume loading safely.'
    ],
    signs: [
      'Sectional or rolling doors hesitate, reverse unexpectedly, or stop before full open height.',
      'Your team hears spring strain, chain chatter, or loud vibration during each cycle.',
      'Dock temperatures fluctuate and interior climate control costs continue to rise.',
      'Door panels show impact damage, cracked hinges, or fatigue around reinforcement points.',
      'Forklift traffic and truck schedules are being delayed by recurring door resets.'
    ],
    processSteps: [
      'Perform a full site walk of each active bay, documenting safety concerns and cycle-related wear.',
      'Inspect springs, cables, rollers, hinges, tracks, operators, and sensor systems for failure risk.',
      'Review opening dimensions and building conditions to confirm compatible door and hardware specs.',
      'Complete repairs or replacement work using commercial-rated components and calibrated spring balance.',
      'Test door travel, photo-eye response, reverse limits, and emergency release function before turnover.',
      'Provide service notes, lifecycle recommendations, and a maintenance schedule for ongoing reliability.'
    ],
    options: [
      'Insulated and non-insulated sectional door profiles for different temperature and budget goals.',
      '24-gauge to heavier commercial steel options with impact-resistant reinforcement packages.',
      'Light-duty, standard-duty, and high-cycle spring assemblies matched to opening frequency.',
      'Window configurations including clear, frosted, and insulated lites for visibility and daylighting.',
      'Color selections in white, sandstone, bronze, charcoal, and facility-specific custom finishes.',
      'Security options such as keyed controls, smart access logging, and stronger perimeter sealing.'
    ],
    optionsSummary:
      'Every warehouse has different throughput, compliance, and energy goals. We explain door materials, insulation value, panel construction, wind-load ratings, and glazing options in plain language so operations leaders can make confident decisions. The result is a practical plan that protects uptime, worker safety, and long-term maintenance budgets.',
    whyChoose:
      'Buck Strong Garage Doors is a Cincinnati partner for distribution teams that cannot afford downtime. Our technicians are trained on commercial systems, communicate clearly with facility managers, and keep job sites organized so freight operations continue with minimal disruption. We are known for dependable arrival windows, transparent recommendations, and workmanship that holds up under high daily cycle counts.',
    areaSummary:
      'We service warehouse and distribution facilities throughout Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and nearby industrial corridors in Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Warehouse Door Service Cincinnati OH | Buck Strong Garage Doors',
    metaDescription:
      'Commercial warehouse and distribution door service in Cincinnati, OH. Compare steel options, insulation, windows, sizes, and safety ratings. Call now.',
    heroImage: warehouseHeroImage,
    heroAlt: 'Warehouse distribution center overhead door service in Cincinnati, Ohio',
    relatedSlugs: ['dock-industrial-door-equipment-service', 'retail-municipal-garage-door-service']
  },
  {
    slug: 'dock-industrial-door-equipment-service',
    serviceName: 'Dock & Industrial Door Equipment Service',
    cardTitle: 'Dock & Industrial Equipment',
    intro:
      'Loading docks and industrial door systems must perform safely under pressure, especially at active facilities around Cincinnati, OH. Our dock and industrial door equipment service includes overhead doors, rolling steel curtains, dock leveler interfaces, and operator controls that keep freight moving without avoidable interruptions. We coordinate repairs and upgrades around shift windows so your receiving and shipping teams stay productive. Businesses that need expert garage door repair Cincinnati support for demanding environments rely on our structured process and commercial-grade parts.',
    details: [
      'Industrial openings often fail because related components are out of sync, not because one part alone is bad. We inspect door balance, track geometry, dock equipment alignment, and control logic as a complete system so recurring problems are corrected at the root. This reduces downtime and improves operator confidence during busy truck schedules.',
      'When modernization is needed, we help you compare heavier-duty materials, thermal separation, corrosion resistance, and visibility enhancements for safer loading zones. We can also phase projects by bay to avoid full-facility disruption. For after-hours breakdowns, our emergency garage door repair Cincinnati response can secure access points and restore safe operation quickly.'
    ],
    signs: [
      'Leveler transitions and door clearance are inconsistent, creating loading delays or safety concerns.',
      'Rolling steel doors bind, misalign, or require repeated manual intervention to complete a cycle.',
      'Operators trip limits, overheat, or show intermittent response from controls and safety devices.',
      'Door hardware corrodes quickly in high-moisture, washdown, or temperature-sensitive zones.',
      'Inspection reports show unresolved deficiencies that could impact compliance readiness.'
    ],
    processSteps: [
      'Review current dock flow, trailer approach patterns, and critical safety points at each service bay.',
      'Inspect curtain slats, guides, springs, operators, controls, seals, and dock-adjacent hardware.',
      'Measure opening dimensions and confirm cycle requirements for proper spring and motor sizing.',
      'Repair or replace worn components using industrial-rated materials matched to facility demands.',
      'Calibrate travel limits, sensing edges, and photo-eyes to ensure safe, repeatable operation.',
      'Document results, recommend preventive intervals, and outline upgrade paths for future planning.'
    ],
    options: [
      'Insulated rolling steel, ribbed sectional, and full-view industrial door configurations.',
      'Performance ratings for wind load, cycle frequency, and thermal efficiency based on use case.',
      'Vision panel choices including wired glass, tempered glass, and impact-rated alternatives.',
      'Powder-coated and corrosion-resistant material packages for washdown and humid environments.',
      'Dock control integrations, smart operator controls, and monitored access hardware upgrades.',
      'Custom width, height, and high-lift track setups for oversized freight and specialty equipment.'
    ],
    optionsSummary:
      'Our team translates technical specs into straightforward recommendations your operations and maintenance teams can approve with confidence. We cover door style, material, insulation, color matching, glazing, and performance ratings while prioritizing safety, uptime, and long-term serviceability. You get a clear scope, practical sequencing, and no guesswork around what each upgrade accomplishes.',
    whyChoose:
      'Buck Strong supports Cincinnati industrial clients with a disciplined, documentation-first workflow. We understand how dock bottlenecks affect labor, carrier schedules, and customer commitments, so we focus on precision diagnostics and durable results. From first call to final signoff, your team gets responsive communication and professional execution built for high-use facilities.',
    areaSummary:
      'Our commercial crews serve Cincinnati and neighboring areas including West Chester, Mason, Blue Ash, Loveland, Hamilton, Fairfield, and nearby corridors across Southwest Ohio.',
    metaTitle: 'Dock Door Equipment Service Cincinnati OH | Buck Strong',
    metaDescription:
      'Dock and industrial garage door equipment service in Cincinnati, OH. Improve safety ratings, insulation, materials, and bay performance with Buck Strong.',
    heroImage: dockHeroImage,
    heroAlt: 'Industrial loading dock overhead door equipment service in Cincinnati',
    relatedSlugs: ['warehouse-distribution-door-service', 'retail-municipal-garage-door-service']
  },
  {
    slug: 'retail-municipal-garage-door-service',
    serviceName: 'Retail & Municipal Garage Door Service',
    cardTitle: 'Retail & Municipal Sites',
    intro:
      'Retail storefronts, municipal garages, and public-service facilities need dependable doors that protect assets, control noise, and support daily access routines in Cincinnati, OH. Our retail and municipal garage door service covers sectional doors, security shutters, fleet-bay overhead systems, and access controls with a focus on safety and public-facing reliability. We work with property managers, city departments, and facility coordinators who need minimal disruption and clear accountability. For trusted garage door service Cincinnati OH organizations can schedule confidently, our team delivers fast diagnostics and conversion-focused recommendations.',
    details: [
      'Public and customer-facing properties have unique requirements for appearance, quiet operation, and security. We inspect door balance, curb appeal factors, weather sealing, and control hardware so each opening functions well while maintaining a professional exterior. This is especially important for mixed-use properties where first impressions and safety standards matter equally.',
      'If your system is aging, we can outline staged upgrades that improve insulation, reliability, and access control without forcing a full immediate replacement. We also support emergency garage door repair Cincinnati requests when storefront security or municipal response readiness is at risk. Every recommendation is documented so decision-makers can compare short-term repairs against long-term lifecycle value.'
    ],
    signs: [
      'Storefront or service-bay doors open noisily, move unevenly, or create customer-facing disruptions.',
      'Older doors no longer seal well, causing drafts and rising heating or cooling expenses.',
      'Fleet garages experience slow open times that interfere with dispatch readiness.',
      'Security shutters or overhead doors show visible wear, dents, or unreliable locking behavior.',
      'You need updated colors, windows, and materials that better match current branding or architecture.'
    ],
    processSteps: [
      'Assess each opening for structural condition, usage pattern, and day-to-day operational priorities.',
      'Inspect springs, cables, tracks, operators, sensors, and security hardware for safety and reliability.',
      'Confirm opening sizes, code expectations, and design constraints for retail or municipal use.',
      'Complete targeted repairs or install replacement components with clean, low-disruption workflows.',
      'Tune door travel, quiet operation, and safety reverse settings before final performance checks.',
      'Deliver a clear summary with next-step options, maintenance intervals, and budget-aware upgrade paths.'
    ],
    options: [
      'Sectional steel, rolling shutter, and insulated service-door profiles for varied facility demands.',
      'Color and finish options that align with storefront branding or municipal building standards.',
      'Window choices including narrow vision lites, frosted privacy glass, and insulated glazing.',
      'Thermal insulation upgrades to reduce drafts and improve year-round comfort near occupied spaces.',
      'Heavy-duty hardware and cycle-rated components for high-use fleet and public-service bays.',
      'Manual, chain-hoist, and motorized operator systems with secure access-control integrations.'
    ],
    optionsSummary:
      'We help facility leaders choose practical combinations of style, material, size, insulation, and performance rating based on operational goals. Whether you need quieter customer-facing doors or tougher fleet-bay hardware, we map each option to expected use, maintenance effort, and budget. This planning-first method keeps projects efficient and easy to approve.',
    whyChoose:
      'Buck Strong Garage Doors is known throughout Cincinnati for responsive service and high standards on both private and public-facing properties. Our technicians prioritize safety, communicate clearly with on-site stakeholders, and deliver polished results that support daily operations. Clients choose us because we combine local accountability with the technical depth required for complex commercial environments.',
    areaSummary:
      'We provide retail and municipal garage door service in Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and surrounding neighborhoods and counties across the greater metro area.',
    metaTitle: 'Retail & Municipal Garage Door Service Cincinnati OH',
    metaDescription:
      'Retail and municipal garage door service in Cincinnati, OH. Explore colors, windows, insulation, ratings, and material options with Buck Strong Garage Doors.',
    heroImage: storefrontHeroImage,
    heroAlt: 'Retail and municipal garage door service for secure Cincinnati facilities',
    relatedSlugs: ['warehouse-distribution-door-service', 'dock-industrial-door-equipment-service']
  }
];

export const getCommercialServiceBySlug = (slug: string): CommercialServicePage | undefined =>
  COMMERCIAL_SERVICE_PAGES.find((service) => service.slug === slug);
