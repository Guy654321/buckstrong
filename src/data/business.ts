import { buildAbsoluteUrl, getSiteOrigin } from '../utils/site-origin';

const SITE_ORIGIN = getSiteOrigin();
const LOGO_PATH = '/images/derby-city-logo.png';

export const BUSINESS_INFO = {
  name: 'Derby Strong Garage Doors',
  legalName: 'Derby Strong Garage Doors LLC',
  telephone: '(513) 440-5123',
  email: 'service@derbystronggaragedoors.com',
  url: SITE_ORIGIN,
  logo: buildAbsoluteUrl(LOGO_PATH, SITE_ORIGIN),
  address: {
    streetAddress: '120 E 8th Street, Suite 200',
    addressLocality: 'Cincinnati',
    addressRegion: 'OH',
    postalCode: '45202',
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
