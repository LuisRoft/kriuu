import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import Hero from '@/components/hero';
import Marquee from '@/components/marquee';
import QueEsKriuu from '@/components/what-is-kriuu';
import Manifiesto from '@/components/manifesto';
import CodeOfConduct from '@/components/code-of-conduct';
import LoQueHacemos from '@/components/what-we-do';
import Moments from '@/components/moments';
import Directory from '@/components/directory';
import SeoTopics from '@/components/seo-topics';
import BlogPreview from '@/components/blog-preview';
import JoinCta from '@/components/join-cta';
import SiteFooter from '@/components/site-footer';
import JoinProvider from '@/components/join-provider';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { siteDescription, siteKeywords, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Comunidad de tecnología, IA y ética tech en Latam',
  description: siteDescription,
  keywords: siteKeywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kriuu | Comunidad de tecnología, IA y ética tech en Latam',
    description: siteDescription,
    url: siteUrl,
    type: 'website',
  },
};

export default async function Home() {
  const { user, isActive } = await getCurrentSessionUser();
  const isAuthenticated = Boolean(user && isActive);

  return (
    <JoinProvider>
      <main className='font-sans'>
        <SiteHeader isAuthenticated={isAuthenticated} />
        <Hero isAuthenticated={isAuthenticated} />
        <Marquee />
        <QueEsKriuu />
        <Manifiesto />
        <CodeOfConduct />
        <LoQueHacemos />
        <Moments />
        <Directory />
        <SeoTopics />
        <BlogPreview />
        <JoinCta isAuthenticated={isAuthenticated} />
        <SiteFooter />
      </main>
    </JoinProvider>
  );
}
