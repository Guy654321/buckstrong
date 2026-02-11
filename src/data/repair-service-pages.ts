export type RepairServicePage = {
  slug:
    | 'spring-replacement'
    | 'opener-repair'
    | 'cable-repair'
    | 'track-alignment'
    | 'panel-replacement'
    | 'rollers-hinges'
    | 'sensor-alignment'
    | 'weatherstripping'
    | 'maintenance'
    | 'balance-adjustment';
  serviceName: string;
  cardTitle: string;
  intro: string;
  signs: string[];
  processSteps: string[];
  options: string[];
  optionsSummary: string;
  whyChoose: string;
  areaSummary: string;
  metaTitle: string;
  metaDescription: string;
  relatedSlugs: Array<RepairServicePage['slug']>;
};

export const REPAIR_SERVICE_PAGES: RepairServicePage[] = [
  {
    slug: 'spring-replacement',
    serviceName: 'Garage Door Spring Replacement',
    cardTitle: 'Spring Replacement',
    intro:
      'When a spring breaks, your garage door can become heavy, crooked, or completely stuck. Our garage door spring replacement in Cincinnati, OH is designed for fast, safe recovery with the correct spring size, cycle rating, and balance setup for your door. Buck Strong technicians handle torsion and extension systems and complete a full safety tune with every repair. If you need garage door repair Cincinnati homeowners trust, we can usually respond the same day.',
    signs: [
      'Loud snap from the garage followed by a door that will not open.',
      'Door feels unusually heavy when lifting manually.',
      'Gaps in torsion springs or visibly stretched extension springs.',
      'Opener strains, hums, or reverses before the door fully opens.',
      'Door rises a few inches, then drops or sits unevenly on the floor.'
    ],
    processSteps: [
      'Inspect springs, cables, drums, bearings, and center brackets for wear and safety risks.',
      'Measure door weight and dimensions to match the correct spring wire size and length.',
      'Remove damaged springs and install high-cycle replacements with new hardware when needed.',
      'Set spring tension, rebalance the door, and adjust opener travel and force settings.',
      'Run full safety tests including auto-reverse, photo-eye response, and manual operation check.'
    ],
    options: [
      'Standard-cycle and high-cycle torsion spring packages.',
      'Galvanized spring upgrades for improved corrosion resistance.',
      'Extension spring conversion recommendations for older systems.',
      'Preventive tune-up bundles with rollers, hinges, and lubrication service.'
    ],
    optionsSummary:
      'We explain all spring options clearly so you can choose the best value for your home, usage level, and long-term reliability goals. Every option includes precise balancing and safety checks for dependable daily operation.',
    whyChoose:
      'Cincinnati homeowners choose Buck Strong because we focus on durable repairs instead of temporary fixes. Our team arrives with stocked trucks, uses proven spring calculations, and documents each adjustment so your door runs smoothly after service. For garage door service Cincinnati OH families can rely on, we combine transparent pricing, prompt scheduling, and professional workmanship on every visit.',
    areaSummary:
      'We provide emergency garage door repair Cincinnati and surrounding communities including West Chester, Mason, Blue Ash, Loveland, Hamilton, and homes throughout Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Garage Door Spring Replacement Cincinnati OH | Buck Strong',
    metaDescription:
      'Need garage door spring replacement in Cincinnati, OH? Buck Strong provides same-day spring service, door balancing, and safety testing. Call now for a quote.',
    relatedSlugs: ['cable-repair', 'balance-adjustment', 'maintenance']
  },
  {
    slug: 'opener-repair',
    serviceName: 'Garage Door Opener Repair',
    cardTitle: 'Opener Repair',
    intro:
      'A failing opener can leave you locked in, locked out, or dealing with random door movement that disrupts your day. Our garage door opener repair in Cincinnati, OH addresses motor faults, drive wear, logic board issues, and control problems with remotes, keypads, and wall consoles. We service most major opener brands and test the full system before we leave. For dependable garage door repair Cincinnati residents call when convenience and safety matter, Buck Strong delivers practical solutions fast.',
    signs: [
      'Motor runs but the door does not move or only jerks partway.',
      'Remote controls or keypad work inconsistently.',
      'Door reverses unexpectedly or stops before fully closing.',
      'Grinding, clicking, or belt/chain chatter from the opener rail.',
      'Wall button flashes error codes or loses power intermittently.'
    ],
    processSteps: [
      'Perform diagnostic testing on power supply, control board, drive assembly, and sensors.',
      'Check travel limits, force settings, and emergency release operation.',
      'Repair or replace worn gears, sprockets, capacitors, or logic components as needed.',
      'Reprogram remotes and keypad access while confirming secure signal pairing.',
      'Complete safety reversal testing and final cycle verification under load.'
    ],
    options: [
      'Chain, belt, and screw drive repair paths based on opener type.',
      'Quiet motor and smart Wi-Fi opener upgrade recommendations.',
      'Battery backup and surge protection add-ons for outage resilience.',
      'Security-focused keypad and rolling-code remote setup options.'
    ],
    optionsSummary:
      'We outline repair-versus-replacement choices so you can decide whether restoring your current unit or upgrading will be the better investment for your home. Our goal is quiet, reliable operation with modern safety features.',
    whyChoose:
      'Buck Strong is trusted for opener troubleshooting because we diagnose the entire system, not just a single symptom. That means fewer callbacks and more predictable performance. If you need garage door service Cincinnati OH homeowners recommend for honest guidance, you will get clear estimates, quality parts, and workmanship backed by local experience.',
    areaSummary:
      'Our team serves Cincinnati plus West Chester, Mason, Blue Ash, Loveland, Hamilton, and neighboring parts of Hamilton, Butler, Warren, and Clermont counties with responsive scheduling.',
    metaTitle: 'Garage Door Opener Repair Cincinnati OH | Buck Strong',
    metaDescription:
      'Professional garage door opener repair in Cincinnati, OH. We fix motors, remotes, sensors, and logic boards with same-day service available. Get a quote today.',
    relatedSlugs: ['sensor-alignment', 'track-alignment', 'maintenance']
  },
  {
    slug: 'cable-repair',
    serviceName: 'Garage Door Cable Repair',
    cardTitle: 'Cable Repair/Replacement',
    intro:
      'Lift cables handle extreme tension every time your garage door opens and closes. When cables fray, slip off the drum, or snap, the door can tilt, jam, or drop without warning. Our garage door cable repair in Cincinnati, OH restores safe lifting by correcting cable path, drum alignment, and spring balance in one visit. If you are searching for garage door repair Cincinnati specialists who prioritize safety and long-term performance, Buck Strong is ready to help.',
    signs: [
      'Frayed strands or unraveling cable near bottom brackets.',
      'Door hangs crooked or one side rises faster than the other.',
      'Cable has jumped off the drum or appears loose when door is closed.',
      'Grinding or binding noises as the door travels through tracks.',
      'Door gets stuck halfway and strains the opener motor.'
    ],
    processSteps: [
      'Secure the door and release tension safely before any cable handling begins.',
      'Inspect drums, shafts, bottom fixtures, bearings, and spring condition.',
      'Install properly rated cables and reset them on the drums with precise tracking.',
      'Rebalance spring tension so both sides lift evenly through a full cycle.',
      'Verify smooth movement, opener load, and safety reversal response.'
    ],
    options: [
      'Standard and heavy-duty cable materials for different door weights.',
      'Cable-and-drum replacement packages for worn lift assemblies.',
      'Corrosion-resistant hardware upgrades for humid garage conditions.',
      'Preventive inspections to catch uneven wear before failure.'
    ],
    optionsSummary:
      'Every cable repair includes recommendations based on your door size, usage frequency, and current hardware condition. We focus on dependable lift performance and safer day-to-day operation for your household.',
    whyChoose:
      'Cincinnati property owners call Buck Strong for cable work because we fix the root cause rather than simply rewrapping a cable and leaving. Our technicians inspect related parts, document what was corrected, and make sure the system cycles cleanly before completion. That is the level of garage door service Cincinnati OH customers expect when reliability matters.',
    areaSummary:
      'We perform emergency garage door repair Cincinnati services in neighborhoods across the city and nearby West Chester, Mason, Blue Ash, Loveland, Hamilton, and surrounding county communities.',
    metaTitle: 'Garage Door Cable Repair Cincinnati OH | Buck Strong',
    metaDescription:
      'Need garage door cable repair in Cincinnati, OH? We replace frayed or broken lift cables, reset drums, and rebalance doors for smooth safe travel.',
    relatedSlugs: ['spring-replacement', 'track-alignment', 'balance-adjustment']
  },
  {
    slug: 'track-alignment',
    serviceName: 'Garage Door Track Alignment & Off-Track Reset',
    cardTitle: 'Track Alignment & Off-Track Reset',
    intro:
      'Misaligned tracks can make your garage door noisy, shaky, and risky to operate. If rollers are binding or the door has come off track, quick professional correction prevents further panel damage and hardware failure. Our track alignment and off-track reset service in Cincinnati, OH restores smooth travel by adjusting rails, brackets, and roller path under controlled conditions. For precise garage door repair Cincinnati homeowners can trust, Buck Strong provides efficient on-site correction and safety validation.',
    signs: [
      'Door rubs, jerks, or vibrates while opening and closing.',
      'Visible gaps between rollers and track sections.',
      'Bent vertical or horizontal rails after impact.',
      'Door appears tilted and will not seal evenly at the floor.',
      'Rollers have popped out and door is partially off track.'
    ],
    processSteps: [
      'Stabilize the door and inspect rails, brackets, hinges, and roller condition.',
      'Measure track plumb, spacing, and curvature to identify alignment faults.',
      'Straighten or replace damaged sections and retighten mounting hardware.',
      'Reset rollers safely into the track path and rebalance travel resistance.',
      'Test multiple open-close cycles and confirm opener force and safety settings.'
    ],
    options: [
      'Minor alignment correction for shifted but intact track assemblies.',
      'Section replacement when rails are kinked or structurally compromised.',
      'Nylon roller upgrades to reduce noise and track wear.',
      'Hardware reinforcement for higher-use residential doors.'
    ],
    optionsSummary:
      'We provide clear options based on whether your tracks can be corrected or should be replaced. Our recommendations are practical, safety-focused, and tailored to long-term performance in daily use.',
    whyChoose:
      'Buck Strong is the local team Cincinnati residents call when off-track situations need skilled handling. We take time to reset the door correctly, protect surrounding hardware, and confirm smooth operation before sign-off. That commitment to detail keeps our garage door service Cincinnati OH customers confident in every repair outcome.',
    areaSummary:
      'Our off-track and alignment service is available in Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and additional communities throughout Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Garage Door Track Alignment Cincinnati OH | Buck Strong',
    metaDescription:
      'Garage door off track in Cincinnati, OH? We realign rails, reset rollers, and restore safe smooth door travel with same-day repair options.',
    relatedSlugs: ['rollers-hinges', 'panel-replacement', 'cable-repair']
  },
  {
    slug: 'panel-replacement',
    serviceName: 'Garage Door Panel & Section Replacement',
    cardTitle: 'Panel & Section Replacement',
    intro:
      'Damaged garage door panels can affect curb appeal, insulation, and structural strength. Our panel and section replacement service in Cincinnati, OH is ideal when impact dents, rust, or cracking are limited to specific sections and the rest of the system remains in good condition. We match style and fit as closely as possible, then recalibrate door movement for smooth operation. For quality garage door repair Cincinnati homeowners can use to avoid full replacement, Buck Strong offers practical section-level solutions.',
    signs: [
      'Visible dents, cracks, or warping in one or more panels.',
      'Door closes unevenly after minor impact damage.',
      'Rusted lower section from moisture exposure near driveway grade.',
      'Gaps around panel joints causing drafts and water intrusion.',
      'Noisy travel because damaged sections no longer track straight.'
    ],
    processSteps: [
      'Inspect full door structure to confirm section replacement is appropriate.',
      'Identify compatible panel profile, insulation type, and finish options.',
      'Remove damaged sections and install replacement panels with aligned hardware.',
      'Adjust hinges, rollers, and track contact points for proper door geometry.',
      'Complete balance and safety testing to confirm stable operation.'
    ],
    options: [
      'Single-panel and multi-section replacement configurations.',
      'Insulated and non-insulated panel choices based on budget and comfort needs.',
      'Window section upgrades for added natural light and exterior appearance.',
      'Color and trim matching guidance for a cohesive finished look.'
    ],
    optionsSummary:
      'We help you compare section replacement against full door replacement by reviewing age, condition, and style compatibility. You get straightforward recommendations built around value, appearance, and dependable function.',
    whyChoose:
      'Buck Strong combines repair expertise with design awareness, so your restored door looks right and performs correctly. Cincinnati families appreciate our detailed measurements, careful installation practices, and honest advice on whether a panel swap makes financial sense. That is the standard our garage door service Cincinnati OH customers expect from a local specialist.',
    areaSummary:
      'Section replacement appointments are available throughout Cincinnati and nearby West Chester, Mason, Blue Ash, Loveland, Hamilton, plus surrounding neighborhoods in Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Garage Door Panel Replacement Cincinnati OH | Buck Strong',
    metaDescription:
      'Garage door panel replacement in Cincinnati, OH. We replace damaged sections, match style, and tune your system for smooth safe operation.',
    relatedSlugs: ['track-alignment', 'rollers-hinges', 'weatherstripping']
  },
  {
    slug: 'rollers-hinges',
    serviceName: 'Garage Door Roller & Hinge Replacement',
    cardTitle: 'Roller & Hinge Replacement',
    intro:
      'Worn rollers and hinges are one of the biggest causes of noisy, rough garage door travel. Our roller and hinge replacement service in Cincinnati, OH improves door movement, reduces vibration, and lowers stress on your opener and tracks. We replace damaged hardware with properly rated components and then tune the full system for quieter performance. If you want preventive garage door repair Cincinnati homeowners use to extend equipment life, Buck Strong offers efficient hardware upgrades.',
    signs: [
      'Squeaking, rattling, or grinding noise during door movement.',
      'Flat-spotted rollers or visible wheel wobble in the track.',
      'Loose, cracked, or bent hinges between door sections.',
      'Door hesitates near panel joints while opening or closing.',
      'Frequent need for force adjustments on the opener.'
    ],
    processSteps: [
      'Inspect roller condition, hinge wear points, and track contact surfaces.',
      'Confirm door weight class to select compatible hardware grades.',
      'Replace worn rollers and hinges systematically to preserve alignment.',
      'Lubricate moving points and retighten related fasteners.',
      'Run full-cycle testing to verify smooth travel and reduced noise.'
    ],
    options: [
      'Nylon roller upgrades for quieter residential operation.',
      'Steel roller alternatives for heavier-use applications.',
      'Standard and heavy-duty hinge sets matched to door size.',
      'Combined hardware-and-tune-up service plans for long-term care.'
    ],
    optionsSummary:
      'Your technician will explain hardware differences in durability, noise level, and value so you can choose the right setup for your home. We focus on reliability gains you can feel every day.',
    whyChoose:
      'Buck Strong is known in Cincinnati for meticulous hardware service that improves both comfort and safety. We treat roller and hinge work as a full system tune, not a quick swap, which helps prevent repeat issues. That thoughtful approach is why local homeowners count on our garage door service Cincinnati OH team year-round.',
    areaSummary:
      'We serve Cincinnati and surrounding communities including West Chester, Mason, Blue Ash, Loveland, Hamilton, and nearby residential areas across Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Garage Door Roller Replacement Cincinnati OH | Buck Strong',
    metaDescription:
      'Upgrade worn garage door rollers and hinges in Cincinnati, OH. Reduce noise, improve travel, and protect your opener with professional service.',
    relatedSlugs: ['track-alignment', 'maintenance', 'balance-adjustment']
  },
  {
    slug: 'sensor-alignment',
    serviceName: 'Garage Door Safety Sensor Repair & Alignment',
    cardTitle: 'Safety Sensor Fix',
    intro:
      'Safety sensors are critical for preventing accidental door closure on people, pets, or objects. When sensors are misaligned or wiring is compromised, your garage door may reverse unexpectedly or refuse to close at all. Our safety sensor repair and alignment service in Cincinnati, OH restores dependable operation with precise beam positioning and electrical testing. For trusted garage door repair Cincinnati homeowners rely on for both convenience and safety, Buck Strong provides accurate diagnostics and fast corrections.',
    signs: [
      'Door starts closing then reverses immediately.',
      'Opener lights blink repeatedly during close commands.',
      'Sensor indicator LEDs are off or flickering.',
      'Door closes only when wall button is held continuously.',
      'Recent bumps, moisture, or wiring damage near sensor mounts.'
    ],
    processSteps: [
      'Inspect sensor brackets, lens condition, and wiring integrity at both sides.',
      'Test voltage, continuity, and signal stability through the opener board.',
      'Realign photo-eyes to establish a clean, consistent safety beam.',
      'Repair damaged wire runs or replace defective sensors when required.',
      'Verify proper reversal behavior with obstacle and cycle testing.'
    ],
    options: [
      'Sensor realignment for minor shifts caused by vibration or impact.',
      'New sensor kits for failed or incompatible units.',
      'Bracket upgrades for improved stability in active garages.',
      'Full opener safety check including force and travel calibration.'
    ],
    optionsSummary:
      'We provide clear recommendations based on whether adjustment alone will solve the issue or replacement is more reliable. Every repair is validated with real safety testing before completion.',
    whyChoose:
      'Cincinnati homeowners choose Buck Strong for sensor work because we troubleshoot systematically and communicate clearly. Instead of guesswork, you get measured testing, durable repairs, and complete verification that the safety system is functioning as designed. That is how our garage door service Cincinnati OH team protects families and property.',
    areaSummary:
      'Sensor diagnostics and emergency garage door repair Cincinnati appointments are available in Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and surrounding county service areas.',
    metaTitle: 'Garage Door Sensor Repair Cincinnati OH | Buck Strong',
    metaDescription:
      'Garage door won’t close? Get sensor alignment and safety eye repair in Cincinnati, OH. We fix wiring, alignment, and opener safety issues fast.',
    relatedSlugs: ['opener-repair', 'maintenance', 'track-alignment']
  },
  {
    slug: 'weatherstripping',
    serviceName: 'Garage Door Weatherstripping & Seal Replacement',
    cardTitle: 'Weatherstripping & Seals',
    intro:
      'Gaps around your garage door allow drafts, moisture, pests, and road debris into your home. Our weatherstripping and seal replacement in Cincinnati, OH improves comfort, helps protect stored items, and supports better energy efficiency in attached garages. We replace bottom seals, perimeter vinyl, and threshold transitions to restore a tighter barrier against seasonal conditions. For practical garage door repair Cincinnati homeowners use to improve year-round performance, Buck Strong delivers clean, professional seal work.',
    signs: [
      'Daylight visible around the door perimeter when closed.',
      'Water intrusion at the threshold after rain.',
      'Cracked, brittle, or torn bottom seal material.',
      'Increased dust, insects, or outdoor odors inside garage space.',
      'Drafts that make nearby rooms harder to heat or cool.'
    ],
    processSteps: [
      'Inspect existing seal channels, panel edges, and floor contact condition.',
      'Measure door and threshold profile for proper seal compatibility.',
      'Remove worn material and install new bottom and perimeter seals.',
      'Adjust door close limits and contact pressure for full weather seal.',
      'Confirm smooth movement, proper closure, and improved gap control.'
    ],
    options: [
      'Standard bottom astragal and heavy-duty cold-weather seal options.',
      'Perimeter vinyl styles for wood, steel, and composite frame conditions.',
      'Threshold kits for uneven concrete transitions.',
      'Combined seal-and-tune services for improved overall system performance.'
    ],
    optionsSummary:
      'Our team helps you choose seal materials based on local weather exposure, floor condition, and daily door usage. The right combination improves comfort while keeping door operation smooth and consistent.',
    whyChoose:
      'Buck Strong is trusted by Cincinnati homeowners for seal replacement because we focus on fit quality and long-term results, not temporary patching. We align materials carefully, test closure after installation, and explain maintenance steps to extend seal life. This detail-oriented service is central to our garage door service Cincinnati OH reputation.',
    areaSummary:
      'We install garage door seals across Cincinnati plus West Chester, Mason, Blue Ash, Loveland, Hamilton, and nearby service areas throughout Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Garage Door Weatherstripping Cincinnati OH | Buck Strong',
    metaDescription:
      'Replace worn garage door seals in Cincinnati, OH. Buck Strong installs bottom seals and weatherstripping to block drafts, water, and pests.',
    relatedSlugs: ['panel-replacement', 'maintenance', 'track-alignment']
  },
  {
    slug: 'maintenance',
    serviceName: 'Garage Door Tune-Up & Preventive Maintenance',
    cardTitle: 'Door Tune-Up',
    intro:
      'Routine maintenance helps you avoid sudden breakdowns and expensive emergency calls. Our garage door tune-up and preventive maintenance service in Cincinnati, OH includes inspection, lubrication, hardware tightening, and safety testing tailored to your door system. We identify developing issues early so you can plan repairs before they become urgent. For proactive garage door repair Cincinnati homeowners rely on to protect daily access and security, Buck Strong provides thorough seasonal service.',
    signs: [
      'Door operation has become louder or less consistent over time.',
      'Movement appears slower, shakier, or less balanced than before.',
      'You cannot remember the last professional service visit.',
      'Minor issues keep returning after temporary adjustments.',
      'Family members rely heavily on garage access every day.'
    ],
    processSteps: [
      'Conduct a complete visual inspection of springs, cables, rollers, hinges, and tracks.',
      'Lubricate all approved moving points using garage-door-specific products.',
      'Check balance and opener force settings to reduce strain and wear.',
      'Test safety reverse system, photo-eyes, and manual release function.',
      'Provide a service report with prioritized recommendations and timing guidance.'
    ],
    options: [
      'Annual and semiannual tune-up schedules based on usage.',
      'Preventive parts replacement for high-wear hardware.',
      'Opener performance optimization and remote/accessory checks.',
      'Homeowner maintenance coaching for between-visit care.'
    ],
    optionsSummary:
      'Maintenance plans can be customized for light-use homes or high-cycle households with multiple drivers. We help you choose the right cadence to protect reliability and reduce long-term ownership costs.',
    whyChoose:
      'Cincinnati residents choose Buck Strong for maintenance because we treat every tune-up as a performance and safety service, not a quick spray-and-go appointment. Our team documents conditions, explains findings in plain language, and helps you prioritize smart next steps. That consistent, transparent approach defines our garage door service Cincinnati OH standards.',
    areaSummary:
      'Preventive service is available in Cincinnati and nearby West Chester, Mason, Blue Ash, Loveland, Hamilton, and surrounding neighborhoods across Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Garage Door Maintenance Cincinnati OH | Buck Strong',
    metaDescription:
      'Schedule garage door maintenance in Cincinnati, OH. Tune-ups include lubrication, safety testing, balance checks, and preventive repair recommendations.',
    relatedSlugs: ['balance-adjustment', 'rollers-hinges', 'sensor-alignment']
  },
  {
    slug: 'balance-adjustment',
    serviceName: 'Garage Door Balance & Force Adjustment',
    cardTitle: 'Balance & Force Adjustment',
    intro:
      'Proper balance is essential for safe, efficient garage door operation. If spring tension or opener force settings are off, doors can slam, reverse unexpectedly, or overwork critical components. Our balance and force adjustment service in Cincinnati, OH fine-tunes the relationship between springs, door weight, and opener controls for stable movement. For precision garage door repair Cincinnati homeowners trust to reduce wear and improve safety, Buck Strong delivers measured adjustments and complete system checks.',
    signs: [
      'Door drifts up or drops quickly when opened halfway by hand.',
      'Opener struggles at start-up or near floor contact.',
      'Door slams shut or rebounds at the bottom unexpectedly.',
      'Frequent opener force resets are needed to complete cycles.',
      'Uneven spring tension after prior repairs or part replacement.'
    ],
    processSteps: [
      'Evaluate manual balance and identify force imbalances through the full travel arc.',
      'Inspect spring condition, drum positioning, and cable tension symmetry.',
      'Adjust spring tension safely and calibrate opener force/travel settings.',
      'Cycle test repeatedly to verify controlled open and close behavior.',
      'Complete safety checks and document final calibration values.'
    ],
    options: [
      'Balance correction with existing springs when wear is minimal.',
      'Spring replacement recommendations when adjustment range is exhausted.',
      'Opener recalibration for modern units with advanced control settings.',
      'Combined optimization packages with tune-up and hardware inspection.'
    ],
    optionsSummary:
      'We explain whether a simple calibration is enough or if worn springs and hardware should be addressed to hold adjustment longer. The final goal is smooth motion, safer operation, and reduced opener strain.',
    whyChoose:
      'Buck Strong technicians are trusted throughout Cincinnati for precise mechanical setup and transparent communication. We verify every adjustment under real operating conditions and provide clear guidance for ongoing system care. This process-driven workmanship is why homeowners depend on our garage door service Cincinnati OH team when performance issues appear.',
    areaSummary:
      'Balance and force adjustments are available in Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and nearby communities across Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Garage Door Balance Adjustment Cincinnati OH | Buck Strong',
    metaDescription:
      'Correct garage door balance and opener force in Cincinnati, OH. Improve safety, reduce wear, and restore smooth reliable operation with Buck Strong.',
    relatedSlugs: ['spring-replacement', 'maintenance', 'opener-repair']
  }
];

export function getRepairServicePage(slug: RepairServicePage['slug']) {
  return REPAIR_SERVICE_PAGES.find((service) => service.slug === slug);
}
