import type { ImageMetadata } from 'astro';
import balanceAdjustmentImage from '../assets/images/repairs/balance-adjustment.jpg';
import cableRepairImage from '../assets/images/repairs/cable-repair.jpg';
import maintenanceImage from '../assets/images/repairs/maintenance.jpg';
import openerRepairImage from '../assets/images/repairs/opener-repair.jpg';
import panelReplacementImage from '../assets/images/repairs/panel-replacement.jpg';
import rollersHingesImage from '../assets/images/repairs/rollers-hinges.jpg';
import sensorAlignmentImage from '../assets/images/repairs/sensor-alignment.jpg';
import springReplacementImage from '../assets/images/repairs/spring-replacement.jpg';
import trackAlignmentImage from '../assets/images/repairs/track-alignment.jpg';
import weatherstrippingImage from '../assets/images/repairs/weatherstripping.jpg';

export type RepairSlug =
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

export type RepairItem = {
  slug: RepairSlug;
  title: string;
  blurb: string;
  image: ImageMetadata;
  alt: string;
  href: string;
};

export const REPAIRS = [
  {
    slug: 'spring-replacement',
    title: 'Spring Replacement',
    blurb: 'Replace fatigued torsion/extension springs and rebalance the door for safe lifting.',
    image: springReplacementImage,
    alt: 'Professional garage door technician installing new high-tension torsion spring system above residential garage door showing expert spring replacement service with proper safety equipment and tools for Cincinnati, Ohio homeowners',
    href: '/garage-door-spring-replacement-cincinnati-oh'
  },
  {
    slug: 'opener-repair',
    title: 'Opener Repair',
    blurb: 'Fix motors, gear kits, travel limits, remotes, keypads and photo-eyes—most same day.',
    image: openerRepairImage,
    alt: 'Professional garage door opener repair technician diagnosing and fixing motor issues, remote control programming, safety sensor alignment, and mechanical adjustments for reliable garage door operation in Cincinnati, Ohio homes',
    href: '/garage-door-opener-repair-cincinnati-oh'
  },
  {
    slug: 'cable-repair',
    title: 'Cable Repair/Replacement',
    blurb: 'Replace frayed or off-spool lift cables and reset drums for even, smooth travel.',
    image: cableRepairImage,
    alt: 'Professional garage door technician replacing damaged lift cables showing frayed cable repair work near garage door drum and pulley system with proper safety equipment for reliable door operation in Cincinnati, Ohio homes',
    href: '/garage-door-cable-repair-cincinnati-oh'
  },
  {
    slug: 'track-alignment',
    title: 'Track Alignment & Off-Track Reset',
    blurb: 'Straighten bent rails, realign hardware, and safely reset off-track doors.',
    image: trackAlignmentImage,
    alt: 'Professional garage door technician realigning bent vertical tracks and adjusting hardware with precision tools, showing expert track straightening and off-track door reset service for smooth garage door operation in Cincinnati, Ohio homes',
    href: '/garage-door-track-alignment-cincinnati-oh'
  },
  {
    slug: 'panel-replacement',
    title: 'Panel & Section Replacement',
    blurb: 'Swap damaged sections and restore structure, seal, and curb appeal.',
    image: panelReplacementImage,
    alt: 'Professional garage door technician removing and replacing damaged garage door panel sections, showing expert panel replacement service to restore structural integrity, weather sealing, and enhanced curb appeal for Cincinnati, Ohio residential properties',
    href: '/garage-door-panel-replacement-cincinnati-oh'
  },
  {
    slug: 'rollers-hinges',
    title: 'Roller & Hinge Replacement',
    blurb: 'Upgrade worn hardware to quiet the door and reduce strain on the system.',
    image: rollersHingesImage,
    alt: 'Professional garage door technician installing new nylon rollers and hinges showing expert hardware replacement service with precision tools to reduce noise, improve smooth operation, and extend garage door system lifespan for Cincinnati, Ohio homeowners',
    href: '/garage-door-rollers-hinges-cincinnati-oh'
  },
  {
    slug: 'sensor-alignment',
    title: 'Safety Sensor Fix',
    blurb: 'Correct misalignment or wiring faults that cause random reversals.',
    image: sensorAlignmentImage,
    alt: 'Professional garage door technician adjusting and aligning photo-eye safety sensors at garage door base, showing expert sensor repair work including wiring inspection, beam alignment, and safety system calibration to prevent random reversals for Cincinnati, Ohio homeowners',
    href: '/garage-door-sensor-alignment-cincinnati-oh'
  },
  {
    slug: 'weatherstripping',
    title: 'Weatherstripping & Seals',
    blurb: 'Replace bottom seals and perimeter rubber to stop drafts, pests, and water.',
    image: weatherstrippingImage,
    alt: 'Professional garage door technician installing new bottom weather seal and perimeter rubber weatherstripping, showing expert seal replacement service to prevent drafts, water infiltration, pest entry, and improve energy efficiency for Cincinnati, Ohio residential properties',
    href: '/garage-door-weatherstripping-cincinnati-oh'
  },
  {
    slug: 'maintenance',
    title: 'Door Tune-Up',
    blurb: 'Full inspection, lubrication, balance and force checks to prevent breakdowns.',
    image: maintenanceImage,
    alt: 'Professional garage door technician performing comprehensive tune-up maintenance service including lubrication, hardware inspection, balance testing, and safety system calibration to prevent breakdowns and extend garage door lifespan for Cincinnati, Ohio homeowners',
    href: '/garage-door-maintenance-cincinnati-oh'
  },
  {
    slug: 'balance-adjustment',
    title: 'Balance & Force Adjustment',
    blurb: 'Set proper spring balance and opener forces for safe, reliable operation.',
    image: balanceAdjustmentImage,
    alt: 'Professional garage door technician performing precise balance and force adjustment testing with specialized equipment, showing expert calibration of spring tension and opener force settings to ensure safe, reliable garage door operation and prevent premature wear for Cincinnati, Ohio homeowners',
    href: '/garage-door-balance-adjustment-cincinnati-oh'
  }
] satisfies RepairItem[];
