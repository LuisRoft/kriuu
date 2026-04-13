import type { Metadata } from 'next';
import { Geist, Space_Grotesk } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-display',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata: Metadata = {
  title: 'kriuu.',
  description:
    'La crew de engineers, designers y founders construyendo desde Latam.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'kriuu.',
    description:
      'La crew de engineers, designers y founders construyendo desde Latam.',
    url: siteUrl,
    siteName: 'kriuu.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'kriuu. — La crew de engineers, designers y founders construyendo desde Latam.',
      },
    ],
    locale: 'es_LA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kriuu.',
    description:
      'La crew de engineers, designers y founders construyendo desde Latam.',
    images: ['/api/og'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='es'
      className={cn('scroll-smooth font-sans', spaceGrotesk.variable)}
    >
      <body className={`${geist.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
