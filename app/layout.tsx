import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';
import RouteHistoryTracker from '@/components/route-history-tracker';
import { cn } from '@/lib/utils';
import { siteDescription, siteKeywords, siteName, siteUrl } from '@/lib/site';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'kriuu. | Comunidad de tecnología, IA y ética tech en Latam',
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: siteName,
  authors: [{ name: 'Kriuu' }],
  creator: 'Kriuu',
  publisher: 'Kriuu',
  category: 'technology',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'kriuu. | Comunidad de tecnología, IA y ética tech en Latam',
    description: siteDescription,
    url: siteUrl,
    siteName,
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
    title: 'kriuu. | Comunidad de tecnología, IA y ética tech en Latam',
    description: siteDescription,
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
      suppressHydrationWarning
    >
      <body className={`${geist.variable} antialiased`}>
        <script
          type='application/ld+json'
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Kriuu',
              alternateName: 'kriuu.',
              url: siteUrl,
              description: siteDescription,
              areaServed: ['Ecuador', 'Latam'],
              foundingLocation: {
                '@type': 'Place',
                name: 'Manabí, Ecuador',
              },
              knowsAbout: [
                'Tecnología',
                'Inteligencia artificial',
                'Ética tecnológica',
                'Comunidades tech',
                'Desarrollo de software',
                'Diseño',
                'Emprendimiento',
              ],
            }),
          }}
        />
        <Suspense fallback={null}>
          <RouteHistoryTracker />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
