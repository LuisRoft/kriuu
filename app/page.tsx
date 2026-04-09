import SiteHeader from '@/components/site-header';
import Hero from '@/components/hero';
import Manifiesto from '@/components/manifiesto';
import Ecosistema from '@/components/ecosistema';
import JoinCta from '@/components/join-cta';
import SiteFooter from '@/components/site-footer';

export default function Home() {
  return (
    <main className='font-sans'>
      <SiteHeader />
      <Hero />
      <Manifiesto />
      <Ecosistema />
      <JoinCta />
      <SiteFooter />
    </main>
  );
}
