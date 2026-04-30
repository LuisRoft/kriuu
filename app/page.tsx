import SiteHeader from '@/components/site-header';
import Hero from '@/components/hero';
import Marquee from '@/components/marquee';
import QueEsKriuu from '@/components/what-is-kriuu';
import Manifiesto from '@/components/manifesto';
import CodeOfConduct from '@/components/code-of-conduct';
import LoQueHacemos from '@/components/what-we-do';
import Moments from '@/components/moments';
import Directory from '@/components/directory';
import JoinCta from '@/components/join-cta';
import SiteFooter from '@/components/site-footer';
import JoinProvider from '@/components/join-provider';

export default function Home() {
  return (
    <JoinProvider>
      <main className='font-sans'>
        <SiteHeader />
        <Hero />
        <Marquee />
        <QueEsKriuu />
        <Manifiesto />
        <CodeOfConduct />
        <LoQueHacemos />
        <Moments />
        <Directory />
        <JoinCta />
        <SiteFooter />
      </main>
    </JoinProvider>
  );
}
