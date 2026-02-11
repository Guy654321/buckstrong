import type { RepairSlug } from './repairs';

export type OpenerServiceSlug =
  | 'belt-drive-repair'
  | 'chain-drive-repair'
  | 'jackshaft-opener-repair'
  | 'screw-drive-opener-repair';

export type OpenerServicePage = {
  slug: OpenerServiceSlug;
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
  relatedSlugs: RepairSlug[];
};

export const OPENER_SERVICE_PAGES: OpenerServicePage[] = [
  {
    slug: 'belt-drive-repair',
    serviceName: 'Belt-Drive Garage Door Opener Repair',
    cardTitle: 'Belt-Drive Opener Repair',
    intro:
      'If your belt-drive unit has become noisy, sluggish, or unpredictable, our belt-drive garage door opener repair in Cincinnati, OH restores quiet, reliable operation without unnecessary upsells. Belt systems are popular in attached garages because they run smoothly and with less vibration, but worn drive belts, sensor faults, and logic board issues can still cause interruptions. Buck Strong technicians diagnose the full opener assembly, then complete precision adjustments and component repairs that protect your door, rail, and motor over the long term. For garage door repair Cincinnati homeowners can trust for comfort and consistency, we deliver same-day availability throughout the metro.',
    signs: [
      'Opener hums but the belt slips, stalls, or skips during travel.',
      'Noticeably louder operation in a unit that used to be quiet.',
      'Door reverses unexpectedly near the floor or stops mid-cycle.',
      'Intermittent response from remotes, wall controls, or keypad entry.',
      'Visible belt fraying, glazing, or misalignment along the rail.'
    ],
    processSteps: [
      'Inspect the opener rail, belt tension, motor head, and trolley engagement for wear and alignment issues.',
      'Run electrical diagnostics on control board signals, sensor communication, and limit/force settings.',
      'Correct mechanical causes such as damaged belts, worn sprockets, loose mounting points, or rail deflection.',
      'Reprogram remotes and keypad access while confirming rolling-code security and stable wireless response.',
      'Complete safety testing, travel calibration, and final cycle verification under normal door load.'
    ],
    options: [
      'Reinforced replacement belt options for higher daily cycle demand.',
      'Quiet-rail and vibration-isolation upgrades for bedrooms above garages.',
      'Battery backup and surge protection add-ons for outage resilience.',
      'Smart opener integration with app control, alerts, and remote monitoring.'
    ],
    optionsSummary:
      'We explain practical repair and upgrade choices based on age, usage, and budget so you can choose the best value without sacrificing reliability. Our team focuses on reduced noise, smooth operation, and long-term dependability for every belt-drive system we service.',
    whyChoose:
      'Buck Strong is a local team focused on clear diagnostics and workmanship that lasts. Cincinnati homeowners choose us because we tune the entire opener-and-door system, not just one symptom, which helps prevent repeat calls and early component failure. Every visit includes straightforward recommendations, professional calibration, and responsive service from technicians who understand the needs of attached garages and high-traffic households.',
    areaSummary:
      'We provide garage door service Cincinnati OH residents rely on across Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and nearby neighborhoods throughout Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Belt-Drive Garage Door Opener Repair Cincinnati OH | Buck Strong',
    metaDescription:
      'Need belt-drive garage door opener repair in Cincinnati, OH? Buck Strong fixes belts, sensors, remotes, and motor issues with same-day local service.',
    relatedSlugs: ['opener-repair', 'sensor-alignment', 'maintenance']
  },
  {
    slug: 'chain-drive-repair',
    serviceName: 'Chain-Drive Garage Door Opener Repair',
    cardTitle: 'Chain-Drive Opener Repair',
    intro:
      'Chain-drive systems are durable workhorses, but when they shake, jerk, or fall out of adjustment, daily operation can become loud and unreliable. Our chain-drive garage door opener repair in Cincinnati, OH targets the common failure points that create inconsistent door travel, including worn drive components, loose rails, and misconfigured force settings. Buck Strong technicians evaluate both mechanical and electrical performance before recommending service, so you get a repair plan built around long-term value instead of temporary patchwork. If you need garage door service Cincinnati OH homeowners count on for dependable lifting power, our team is ready with fast scheduling and honest guidance.',
    signs: [
      'Rattling, banging, or chain slap during opening and closing cycles.',
      'Door hesitates near the header or starts unevenly from the floor.',
      'Opener strains under load and may trip limits or reverse unexpectedly.',
      'Rail assembly vibrates excessively and transfers noise into the home.',
      'Chain appears loose, rusted, or dry even after basic lubrication.'
    ],
    processSteps: [
      'Inspect chain tension, sprocket wear, trolley movement, and rail mounting stability.',
      'Check door balance and spring support to confirm the opener is not overcompensating for door weight.',
      'Replace worn chain-drive hardware and correct alignment or support bracket issues as needed.',
      'Tune travel and force settings to match door resistance and improve smooth starts/stops.',
      'Perform complete safety reversal tests and multi-cycle operation checks before sign-off.'
    ],
    options: [
      'Standard and heavy-duty chain sets matched to opener model and duty cycle.',
      'Noise-reduction packages with isolation brackets and rail stabilization.',
      'Motor head upgrades when control boards or drive assemblies are beyond cost-effective repair.',
      'Preventive maintenance plans to reduce wear and maintain safe daily performance.'
    ],
    optionsSummary:
      'Chain-drive systems can often be restored efficiently when diagnosed early. We outline part quality, expected lifespan, and upgrade paths so you can select a repair approach that balances performance, durability, and budget for your household.',
    whyChoose:
      'Homeowners throughout the Cincinnati metro choose Buck Strong for practical opener repair backed by detailed system testing. We understand how chain-drive units behave under different door weights and weather conditions, and we adjust every repaired system for safe, repeatable operation. That local experience helps us deliver fewer callbacks and stronger long-term results.',
    areaSummary:
      'From Cincinnati to West Chester, Mason, Blue Ash, Loveland, Hamilton, and surrounding communities in Hamilton, Butler, Warren, and Clermont counties, we provide responsive emergency garage door repair Cincinnati coverage when opener issues disrupt your day.',
    metaTitle: 'Chain-Drive Garage Door Opener Repair Cincinnati OH | Buck Strong',
    metaDescription:
      'Professional chain-drive garage door opener repair in Cincinnati, OH. We fix noisy rails, loose chains, and motor issues with same-day dispatch.',
    relatedSlugs: ['opener-repair', 'track-alignment', 'balance-adjustment']
  },
  {
    slug: 'jackshaft-opener-repair',
    serviceName: 'Jackshaft (Wall-Mount) Opener Repair',
    cardTitle: 'Jackshaft / Direct-Drive Repair',
    intro:
      'Wall-mount jackshaft openers save overhead space and are ideal for high-lift tracks, storage racks, and garages with special ceiling requirements. When these systems lose communication, over-torque, or stop responding to controls, precision diagnosis is critical because multiple safety and travel inputs must work together correctly. Our jackshaft opener repair in Cincinnati, OH addresses motor, encoder, cable tension monitor, and accessory issues with full-cycle testing after each repair. Buck Strong provides garage door repair Cincinnati homeowners trust for advanced opener systems, whether you have a premium smart setup or a retrofit wall-mount conversion.',
    signs: [
      'Wall-mount unit powers on but the door does not move consistently.',
      'Cable tension monitor warnings or flashing diagnostic lights appear.',
      'Door stops abruptly during travel or closes only partway.',
      'Smart app commands fail while wall control operation remains inconsistent.',
      'Side-mount motor creates unusual vibration or torque-related noise.'
    ],
    processSteps: [
      'Inspect torsion shaft interface, cable tension monitoring hardware, and mounting integrity.',
      'Run diagnostic reads for motor control faults, communication errors, and accessory module status.',
      'Repair or replace failed components such as encoders, logic boards, or monitored safety accessories.',
      'Recalibrate travel limits, force thresholds, and smart-control pairings for stable operation.',
      'Verify photo-eye response, auto-reverse behavior, and emergency release function through repeated cycles.'
    ],
    options: [
      'OEM-compatible replacement parts for wall-mount motors and control systems.',
      'Backup battery and Wi-Fi gateway upgrades for outage protection and app access.',
      'High-lift and vertical-lift compatibility checks for specialty track setups.',
      'Integrated lighting and accessory control enhancements for modern convenience.'
    ],
    optionsSummary:
      'Jackshaft repairs require careful matching of accessories and calibration values, especially in custom garage layouts. We provide clear recommendations so you can restore reliable performance while preserving the space-saving benefits of your wall-mount opener.',
    whyChoose:
      'Buck Strong technicians are trained on both traditional and advanced opener architectures, including side-mount systems used in modern Cincinnati homes. We combine accurate diagnostics with clean installation practices and clear communication, so you know exactly what was repaired and why. Our local team is committed to safe operation, quieter performance, and conversion-focused service from first call to final test.',
    areaSummary:
      'We serve homeowners across Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and nearby communities in Hamilton, Butler, Warren, and Clermont counties with same-day garage door service Cincinnati OH support.',
    metaTitle: 'Jackshaft Garage Door Opener Repair Cincinnati OH | Buck Strong',
    metaDescription:
      'Expert jackshaft garage door opener repair in Cincinnati, OH. We fix wall-mount motors, smart controls, and safety monitors for reliable operation.',
    relatedSlugs: ['opener-repair', 'cable-repair', 'maintenance']
  },
  {
    slug: 'screw-drive-opener-repair',
    serviceName: 'Screw-Drive Garage Door Opener Repair',
    cardTitle: 'Screw-Drive Opener Repair',
    intro:
      'Screw-drive opener systems are known for strong lifting speed, but they depend on proper lubrication, alignment, and drive condition to operate reliably through changing temperatures. When these units chatter, bind, or fail to complete travel, our screw-drive opener repair in Cincinnati, OH identifies the exact root cause before parts are replaced. Buck Strong technicians inspect the threaded drive assembly, carriage, and control settings to restore smooth, secure movement with minimal disruption to your routine. For garage door repair Cincinnati property owners rely on when performance and safety both matter, we provide efficient service with transparent next-step recommendations.',
    signs: [
      'Grinding or chattering noise from the opener rail during operation.',
      'Door starts fast but slows, jerks, or stops before full travel.',
      'Intermittent reversal near the floor despite clear sensor lenses.',
      'Excessive rail heat, dry threaded drive, or visible carriage wear.',
      'Frequent manual resets needed to regain normal opener response.'
    ],
    processSteps: [
      'Inspect threaded drive condition, carriage wear points, and lubrication status.',
      'Confirm rail alignment, mounting stability, and compatibility with door balance and spring tension.',
      'Repair or replace worn screw-drive components and recalibrate opener mechanics.',
      'Adjust force/travel settings and verify dependable communication with sensors and controls.',
      'Run repeated open-close cycles with safety validation and final performance confirmation.'
    ],
    options: [
      'OEM and high-durability threaded drive replacement components.',
      'Seasonal lubrication and tune-up plans to reduce temperature-related wear.',
      'Control board and accessory updates for remotes, keypads, and wall stations.',
      'Smart opener conversion paths when replacement is more cost-effective long term.'
    ],
    optionsSummary:
      'Our team reviews repair and upgrade options with clear pricing and expected lifespan so you can make an informed decision. We focus on restoring fast, controlled movement while reducing noise and preventing recurring drivetrain issues.',
    whyChoose:
      'Buck Strong delivers detail-driven opener service backed by local experience in Cincinnati weather conditions and housing styles. We do more than swap parts; we tune complete systems for balance, force, and safety so daily operation feels predictable again. Homeowners choose us for responsive scheduling, professional workmanship, and practical solutions tailored to real usage patterns.',
    areaSummary:
      'Emergency garage door repair Cincinnati appointments are available throughout Cincinnati, West Chester, Mason, Blue Ash, Loveland, Hamilton, and neighboring areas in Hamilton, Butler, Warren, and Clermont counties.',
    metaTitle: 'Screw-Drive Garage Door Opener Repair Cincinnati OH | Buck Strong',
    metaDescription:
      'Schedule screw-drive garage door opener repair in Cincinnati, OH. We fix threaded rail wear, calibration issues, and noisy operation fast.',
    relatedSlugs: ['opener-repair', 'track-alignment', 'rollers-hinges']
  }
];
