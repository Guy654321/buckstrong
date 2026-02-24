import { buildAbsoluteUrl, getSiteOrigin } from '../utils/site-origin';

const SITE_ORIGIN = getSiteOrigin();
const LOGO_PATH = '/images/ohio%20logo.png';


function normalizeBusinessBrand(value: string) {
  return value.replace(/derby\s+strong/gi, 'Buck Strong');
}

export const BUSINESS_INFO = {
  name: normalizeBusinessBrand('Buck Strong Garage Doors'),
  legalName: normalizeBusinessBrand('Buck Strong Garage Doors LLC'),
  telephone: '5137788005',
  email: 'hello@buckstronggaragedoors.com',
  url: buildAbsoluteUrl('/', SITE_ORIGIN),
  logo: buildAbsoluteUrl(LOGO_PATH, SITE_ORIGIN),
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
