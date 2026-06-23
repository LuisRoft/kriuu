export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

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
