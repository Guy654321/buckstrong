import { buildAbsoluteUrl, getSiteOrigin } from '../utils/site-origin';

const SITE_ORIGIN = getSiteOrigin();
const LOGO_PATH = '/images/derby-city-logo.png';

export const BUSINESS_INFO = {
  name: 'Derby Strong Garage Doors',
  legalName: 'Derby Strong Garage Doors LLC',
  telephone: '(502) 619-5198',
  email: 'service@derbystronggaragedoors.com',
  url: SITE_ORIGIN,
  logo: buildAbsoluteUrl(LOGO_PATH, SITE_ORIGIN),
  address: {
    streetAddress: '1237 E Oak Street, Suite #1',
    addressLocality: 'Louisville',
    addressRegion: 'KY',
    postalCode: '40204',
    addressCountry: 'US'
  },
  geo: {
    latitude: 38.240586,
    longitude: -85.731444
  },
  aggregateRating: {
    ratingValue: '5.0',
    reviewCount: '128'
  }
} as const;

export type BusinessInfo = typeof BUSINESS_INFO;
