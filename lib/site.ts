export const productionSiteUrl = 'https://kriuu.com';

export function normalizeSiteUrl(value?: string) {
  const rawValue = value?.trim();

  if (!rawValue) return null;

  const isLocalUrl = /^(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(rawValue);
  const urlWithProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `${isLocalUrl ? 'http' : 'https'}://${rawValue}`;

  try {
    return new URL(urlWithProtocol).origin;
  } catch {
    return null;
  }
}

const configuredSiteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const vercelSiteUrl = normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);

export const siteUrl =
  configuredSiteUrl ??
  (process.env.NODE_ENV === 'production'
    ? productionSiteUrl
    : vercelSiteUrl ?? 'http://localhost:3000');

export const siteName = 'kriuu.';

export const siteDescription =
  'Kriuu quiere construir la mejor comunidad de tecnología del Ecuador: una comunidad de IA, diseño, emprendimiento y ética tecnológica para distintas disciplinas en Manabí y Latam.';

export const siteKeywords = [
  'comunidad de tecnología',
  'comunidad tech',
  'mejor comunidad de tecnología del Ecuador',
  'mejor comunidad tech Ecuador',
  'comunidad de tecnología en Ecuador',
  'IA',
  'inteligencia artificial',
  'ética tecnológica',
  'tecnología ética',
  'startups Latam',
  'tecnología en Ecuador',
  'tecnología en Manabí',
  'innovación',
  'desarrollo de software',
  'diseño',
  'emprendimiento',
  'tecnología para médicos',
  'tecnología para abogados',
  'tecnología para docentes',
  'tecnología para psicólogos',
  'tecnología para diseñadores',
  'tecnología para todos',
  'kriuu',
];
