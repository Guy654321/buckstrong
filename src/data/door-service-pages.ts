import type { ImageMetadata } from 'astro';
import steelHeroImage from '../assets/images/garage-door-installation.jpg';
import woodHeroImage from '../assets/images/dillon-kydd-XGvwt544g8k-unsplash.jpg';
import aluminumHeroImage from '../assets/images/repairs/finished-installation.jpg';
import carriageHeroImage from '../assets/images/b4fc9ccd-57d6-4cb3-9845-af07b269ab3f.png';

export type DoorServiceSlug =
  | 'steel-garage-doors'
  | 'wood-garage-doors'
  | 'aluminum-garage-doors'
  | 'carriage-house-garage-doors';

export type DoorServicePage = {
  slug: DoorServiceSlug;
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
  relatedSlugs: DoorServiceSlug[];
};

export const DOOR_SERVICE_PAGES: DoorServicePage[] = [
  {
    slug: 'steel-garage-doors',
    serviceName: 'Steel Garage Doors Installation',
    cardTitle: 'Steel Garage Doors',
    intro:
      'Steel garage doors are the top choice for many Cincinnati homeowners because they balance durability, design flexibility, and long-term value. Our steel garage doors installation in Cincinnati, OH includes precise measurements, reinforced hardware selection, insulation planning, and finish matching so the final result looks intentional with your exterior. We carry raised-panel, flush, and carriage-inspired steel profiles in multiple gauges, from practical builder-grade options to premium heavy-duty systems. If you are comparing garage door repair Cincinnati options versus replacement, we can inspect your current setup and provide clear recommendations with honest pricing.',
    details: [
      'Steel systems also provide one of the broadest ranges of sizes for single-car, double-car, oversized, and high-lift garage configurations. We verify headroom and side-room requirements before ordering so your new door seals correctly, cycles quietly, and supports long-term spring life.',
      'For homeowners prioritizing energy efficiency, we break down insulation core options, section joints, perimeter seals, and thermal transfer expectations. That makes it easier to compare short-term pricing against long-term comfort and utility savings, especially when garages are attached to conditioned living spaces.'
    ],
    signs: [
      'Your existing door has repeated panel dents, rust spots, or structural fatigue near hinge points.',
      'You feel large temperature swings in rooms next to the garage and want improved insulation.',
      'The current door is noisy, heavy, or frequently needs adjustment to stay aligned.',
      'You want a modernized exterior with cleaner lines, updated windows, and better curb appeal.',
      'Your opener is overworking due to door weight imbalance or aging track hardware.'
    ],
    processSteps: [
      'Confirm opening dimensions, headroom, sideroom, and backroom to match the correct track and panel system.',
      'Review steel gauge, insulation ratings, color options, and window packages based on budget and home style.',
      'Remove the old door safely, then install new tracks, brackets, springs, and reinforcement struts as needed.',
      'Set spring tension, align sections for even reveal lines, and calibrate opener travel and force limits.',
      'Test safety reverse, photo-eyes, manual release, and weather sealing before final walkthrough and cleanup.'
    ],
    options: [
      'Single-layer, double-layer, and triple-layer steel construction for different strength and efficiency goals.',
      'Short panel, long panel, contemporary flush, and carriage-look stamped steel styles.',
      'Factory color finishes in white, almond, sandstone, bronze, black, and custom order tones.',
      'Insulated cores with multiple R-value ranges to improve comfort and reduce street noise.',
      'Decorative or frosted window inserts in clear, obscure, seeded, and insulated glass formats.'
    ],
    optionsSummary:
      'During your consultation, we compare material thickness, insulation package, window layout, and design accents so you can build a door that fits both daily use and curb-appeal goals. Our team also explains wind-load reinforcement, maintenance expectations, and long-term lifecycle value so your investment is practical, not just attractive.',
    whyChoose:
      'Buck Strong Garage Doors is known for detail-focused steel installations across Cincinnati neighborhoods. We use proper spring math, high-quality mounting hardware, and clear communication from estimate to final inspection. Homeowners choose us for dependable scheduling, clean job sites, and professional results that support both performance and appearance. When customers ask for garage door service Cincinnati OH residents can trust, we deliver craftsmanship with local accountability.',
    areaSummary:
      'We install steel doors in Cincinnati and surrounding communities including West Chester, Mason, Blue Ash, Loveland, Hamilton, Fairfield, and nearby areas throughout Hamilton, Butler, Warren, and Clermont counties. Same-week scheduling is often available, including emergency garage door repair Cincinnati support when your old system fails before replacement day.',
    metaTitle: 'Steel Garage Doors Installation Cincinnati OH | Buck Strong',
    metaDescription:
      'Explore steel garage doors installation in Cincinnati, OH. Compare styles, colors, insulation, and windows with Buck Strong. Call now or get a quote today.',
    heroImage: steelHeroImage,
    heroAlt: 'New insulated steel garage door installed on a Cincinnati home',
    relatedSlugs: ['wood-garage-doors', 'aluminum-garage-doors', 'carriage-house-garage-doors']
  },
  {
    slug: 'wood-garage-doors',
    serviceName: 'Wood Garage Doors Installation',
    cardTitle: 'Wood Garage Doors',
    intro:
      'Wood garage doors deliver a custom, architectural look that can dramatically elevate curb appeal for Cincinnati homes. Our wood garage doors installation in Cincinnati, OH includes species selection, panel configuration planning, stain or paint strategy, and hardware recommendations designed for Ohio weather cycles. From timeless carriage profiles to cleaner contemporary lines, wood offers depth and character that manufactured textures cannot fully replicate. If you need garage door repair Cincinnati homeowners rely on but are ready for a long-term visual upgrade, we can walk through replacement options with side-by-side comparisons.',
    details: [
      'Our team helps you plan for proper panel thickness, reinforcement, and finish protection based on sun exposure, moisture, and street-facing orientation. We also review the effect door weight has on opener capacity so the full system runs safely instead of forcing an underpowered motor to overwork.',
      'Because every facade is different, we build mockup recommendations for color, window proportion, and hardware scale that align with your trim and roofline. This design-first process keeps the installation cohesive and helps homeowners avoid expensive mid-project changes after materials arrive.'
    ],
    signs: [
      'Your current door feels outdated and no longer matches recent exterior upgrades.',
      'You want natural grain textures, custom overlays, or handcrafted detailing unavailable in standard steel lines.',
      'Existing lower panels show water damage, swelling, or repeated paint failure near the weather line.',
      'You are preparing to sell and want a premium first impression from the street.',
      'You want a door style that complements brick, stone, or historic architectural features.'
    ],
    processSteps: [
      'Inspect opening dimensions and framing condition to ensure proper support for wood door weight.',
      'Review design profiles, wood species, finish systems, and insulation-backed constructions.',
      'Create a material and hardware plan including hinges, handles, windows, and weather protection.',
      'Install tracks, spring system, and sections with balanced lift calibration for smooth operation.',
      'Finalize finish protection guidance, maintenance intervals, and complete safety checks and homeowner walkthrough.'
    ],
    options: [
      'Cedar, redwood-look, and engineered wood options for budget and climate performance balance.',
      'Paint-grade and stain-grade surfaces with custom color matching for trim and entry doors.',
      'Traditional raised panel, recessed panel, and carriage house overlay configurations.',
      'Insulated wood-core hybrids to improve thermal control without sacrificing design.',
      'Window configurations including arched lites, divided lites, and obscured privacy glass.'
    ],
    optionsSummary:
      'Wood systems can be tailored to nearly any design direction, but choosing the right finish and construction method is critical for durability in Cincinnati humidity and freeze-thaw swings. We explain realistic upkeep needs, refinish timelines, and material alternatives so you get the right balance of beauty and maintenance commitment.',
    whyChoose:
      'Buck Strong helps homeowners navigate wood door decisions with practical guidance instead of guesswork. Our installers focus on exact fit, balanced movement, and finish longevity while coordinating all accessory details for a cohesive final look. For homeowners seeking premium garage door service Cincinnati OH specialists who understand both performance and architecture, our team delivers personalized results with professional follow-through.',
    areaSummary:
      'Our wood garage door projects span Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, Indian Hill, and nearby communities throughout Southwest Ohio. We also provide emergency garage door repair Cincinnati dispatch when wood doors need urgent panel stabilization, hardware replacement, or safety corrections before full restoration.',
    metaTitle: 'Wood Garage Doors Installation Cincinnati OH | Buck Strong',
    metaDescription:
      'Custom wood garage doors installation in Cincinnati, OH with style, stain, and window options. Buck Strong delivers expert design guidance and installation.',
    heroImage: woodHeroImage,
    heroAlt: 'Custom wood-style garage door enhancing curb appeal at a Cincinnati residence',
    relatedSlugs: ['steel-garage-doors', 'aluminum-garage-doors', 'carriage-house-garage-doors']
  },
  {
    slug: 'aluminum-garage-doors',
    serviceName: 'Aluminum Garage Doors Installation',
    cardTitle: 'Aluminum Garage Doors',
    intro:
      'Aluminum garage doors are ideal for homeowners who want clean modern lines, corrosion resistance, and lightweight performance. Our aluminum garage doors installation in Cincinnati, OH includes full layout planning for frame profiles, glazing selections, and insulation strategy so the door performs as well as it looks. These systems are especially popular on contemporary and mixed-material homes where glass and metal accents are part of the architectural design. Whether you are upgrading for style or replacing a failing system after garage door repair Cincinnati attempts, we build solutions around function, efficiency, and curb appeal.',
    details: [
      'Aluminum doors come in a wide range of rail widths, stiles, and sightline profiles, so we guide you through options that match both privacy needs and architectural rhythm. We can prioritize translucent glass for daylighting, insulated glass for thermal stability, or mixed panel designs for balanced performance.',
      'Sizing accuracy is especially important on full-view systems because reveal consistency impacts the final appearance. Before installation, we confirm opening square, slab transitions, and track tolerances so your finished door looks clean from every angle and operates with minimal vibration.'
    ],
    signs: [
      'You want a lighter door system to reduce wear on springs and opener components.',
      'Your home design favors modern materials and larger glass sections.',
      'You need better corrosion resistance in high-moisture or variable weather conditions.',
      'Current panels are warped, dented, or repeatedly misaligned due to age and fatigue.',
      'You are looking for low-maintenance finishes with long-lasting visual consistency.'
    ],
    processSteps: [
      'Evaluate the garage opening, side clearances, and structural supports for aluminum frame compatibility.',
      'Select frame depth, panel style, glass type, and thermal package based on usage priorities.',
      'Remove old components and install new track, torsion system, and reinforcement where required.',
      'Set spring balance and opener settings for quiet, smooth travel with consistent stopping points.',
      'Perform final safety testing, weather seal verification, and operational walkthrough with care tips.'
    ],
    options: [
      'Full-view aluminum and glass designs for maximum daylight and modern curb presence.',
      'Solid aluminum panel mixes for privacy-focused elevations with contemporary styling.',
      'Clear, frosted, tinted, mirrored, and insulated glass choices for performance and privacy.',
      'Powder-coated finishes in black, bronze, white, silver, and custom architectural colors.',
      'Insulated rail systems and thermal breaks for better energy efficiency in attached garages.'
    ],
    optionsSummary:
      'Aluminum doors give you extensive design control, but glass type and insulation configuration strongly influence comfort, visibility, and energy performance. We provide side-by-side comparisons to help you choose the right blend of style, natural light, privacy, and budget for your home.',
    whyChoose:
      'Buck Strong combines product knowledge with installation precision so aluminum door systems perform reliably year-round in Cincinnati conditions. We help you avoid mismatched hardware, poor thermal choices, and noisy operation issues that can happen with rushed installs. For garage door service Cincinnati OH property owners trust for modern door projects, our team delivers transparent recommendations and clean execution from start to finish.',
    areaSummary:
      'We install aluminum garage doors throughout Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and neighboring communities in Hamilton, Butler, Warren, and Clermont counties. If you have a failure before replacement is complete, our emergency garage door repair Cincinnati response can secure and stabilize your system quickly.',
    metaTitle: 'Aluminum Garage Doors Installation Cincinnati OH | Buck Strong',
    metaDescription:
      'Modern aluminum garage doors installation in Cincinnati, OH. Compare frame styles, glass options, insulation, and colors with Buck Strong Garage Doors.',
    heroImage: aluminumHeroImage,
    heroAlt: 'Contemporary aluminum and glass garage door installation in Cincinnati, Ohio',
    relatedSlugs: ['steel-garage-doors', 'wood-garage-doors', 'carriage-house-garage-doors']
  },
  {
    slug: 'carriage-house-garage-doors',
    serviceName: 'Carriage House Garage Doors Installation',
    cardTitle: 'Carriage House Garage Doors',
    intro:
      'Carriage house garage doors combine classic design character with modern overhead-door convenience, making them a popular upgrade across Cincinnati neighborhoods. Our carriage house garage doors installation in Cincinnati, OH includes overlay style planning, hardware styling, window placement, and insulation recommendations based on your home architecture and daily usage. These doors are available in steel, composite, and wood-inspired constructions so you can achieve the look you want without sacrificing practicality. If repeated garage door repair Cincinnati calls are no longer cost-effective, a carriage house replacement can improve both reliability and visual impact.',
    details: [
      'Carriage-style systems are highly customizable, which is why we focus on proportion and detail selection early in the planning process. We evaluate door width, window rail placement, and decorative hardware spacing so the final look feels authentic rather than ornamental or oversized for the facade.',
      'We also review material choices by maintenance profile, from low-upkeep insulated steel skins to premium composite overlays and stain-grade options. That allows homeowners to choose a style that aligns with both long-term upkeep expectations and the performance demands of daily use.'
    ],
    signs: [
      'You want a higher-end exterior appearance with decorative handles, hinges, and custom panel lines.',
      'Your existing door lacks visual depth and does not complement traditional or farmhouse architecture.',
      'You are investing in exterior remodeling and need a focal upgrade with strong ROI potential.',
      'Current door insulation and sealing are underperforming during winter and summer extremes.',
      'You prefer timeless styling that remains attractive across changing design trends.'
    ],
    processSteps: [
      'Inspect opening geometry and facade proportions to recommend balanced carriage-style panel layouts.',
      'Review material platforms, insulation packages, decorative hardware, and window grille options.',
      'Finalize color or stain direction and coordinate trim, shutters, and entry door compatibility.',
      'Install system components, set spring balance, and align sections for consistent reveal and travel.',
      'Complete safety tests, seal checks, and a finish review so the final look matches your expectations.'
    ],
    options: [
      'Stamped steel carriage styles with low-maintenance woodgrain texture finishes.',
      'Overlay composite and custom wood carriage profiles for distinctive curb-appeal detail.',
      'Decorative hardware sets including strap hinges, clavos, ring pulls, and period-style accents.',
      'Top-section windows in arched, square, crossbuck, and prairie grille patterns.',
      'Insulation and weatherseal upgrades for improved comfort and quieter operation.'
    ],
    optionsSummary:
      'Carriage-style projects benefit from thoughtful design coordination, especially when selecting overlays, window patterns, and hardware scale. We help you choose options that enhance your home instead of overwhelming it, while still ensuring dependable everyday performance and strong thermal protection.',
    whyChoose:
      'Buck Strong is trusted by Cincinnati homeowners who want both design guidance and technical reliability. We translate inspiration photos into practical product choices, verify each fitment detail, and install with the same safety standards we use on all high-cycle systems. For garage door service Cincinnati OH families recommend to friends and neighbors, our team combines craftsmanship, communication, and local experience.',
    areaSummary:
      'Our carriage house installations cover Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and nearby communities across Southwest Ohio and Northern Kentucky service zones. We also provide emergency garage door repair Cincinnati appointments for urgent spring, cable, and track issues while your replacement plan is underway.',
    metaTitle: 'Carriage House Garage Doors Cincinnati OH | Buck Strong',
    metaDescription:
      'Upgrade with carriage house garage doors in Cincinnati, OH. Choose materials, windows, insulation, and hardware with expert installation from Buck Strong.',
    heroImage: carriageHeroImage,
    heroAlt: 'Elegant carriage house garage door with decorative windows and hardware in Cincinnati',
    relatedSlugs: ['steel-garage-doors', 'wood-garage-doors', 'aluminum-garage-doors']
  }
];

export const getDoorServiceBySlug = (slug: string): DoorServicePage | undefined =>
  DOOR_SERVICE_PAGES.find((service) => service.slug === slug);
