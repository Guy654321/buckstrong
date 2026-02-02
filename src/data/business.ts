import { buildAbsoluteUrl, getSiteOrigin } from '../utils/site-origin';

const SITE_ORIGIN = getSiteOrigin();
const LOGO_PATH = '/images/derby-city-logo.png';

export const BUSINESS_INFO = {
  name: 'Buck Strong Garage Doors',
  legalName: 'Buck Strong Garage Doors LLC',
  telephone: '(513) 440-5123',
  email: 'service@derbystronggaragedoors.com',
  url: buildAbsoluteUrl('/locations/cincinnati', SITE_ORIGIN),
  logo: buildAbsoluteUrl(LOGO_PATH, SITE_ORIGIN),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59'
  },
  address: {
    streetAddress: '2337 Victory Parkway, Suite 120',
    addressLocality: 'Cincinnati',
    addressRegion: 'OH',
    postalCode: '45206',
    addressCountry: 'US'
  },
  geo: {
    latitude: 39.1031,
    longitude: -84.5120
  },
  aggregateRating: {
    ratingValue: '5.0',
    reviewCount: '128'
  }
} as const;

export type BusinessInfo = typeof BUSINESS_INFO;
