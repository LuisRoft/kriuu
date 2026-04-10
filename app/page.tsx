import SiteHeader from '@/components/site-header';
import Hero from '@/components/hero';
import Marquee from '@/components/marquee';
import QueEsKriuu from '@/components/what-is-kriuu';
import Manifiesto from '@/components/manifesto';
import LoQueHacemos from '@/components/what-we-do';
import Directory from '@/components/directory';
import JoinCta from '@/components/join-cta';
import SiteFooter from '@/components/site-footer';

export default function Home() {
  return (
    <main className='font-sans'>
      <SiteHeader />
      <Hero />
      <Marquee />
      <QueEsKriuu />
      <Manifiesto />
      <LoQueHacemos />
      <Directory />
      <JoinCta />
      <SiteFooter />
    </main>
  );
}
