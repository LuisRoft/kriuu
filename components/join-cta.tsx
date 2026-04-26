import Image from 'next/image';
import bgCta from '@/public/bgs/bg-cta.webp';
import JoinButton from '@/components/join-button';

export default function JoinCta() {
  return (
    <section
      id='join'
      className='relative flex min-h-150 items-center justify-center overflow-hidden border-t border-dark/8  py-16 md:py-30'
    >
      <Image
        src={bgCta}
        alt=''
        fill
        sizes='100vw'
        placeholder='blur'
        className='pointer-events-none object-cover'
      />

      <div className='relative z-10 mx-auto w-full max-w-310 bg-dark/74 px-8 py-14 text-center md:bg-dark/68 md:backdrop-blur-sm md:px-14 md:py-16'>
        <div className='space-y-5 text-[17px] leading-[1.7] text-cream'>
          <p>
            Kriuu funciona en la medida en que la gente participa, propone y se
            compromete. No somos una plataforma ni un programa. Somos una
            comunidad, lo que significa que es tan buena como las personas que
            la forman.
          </p>
          <p>
            Si construyes algo, si quieres construir algo, o si simplemente
            tienes curiosidad por ver qué están haciendo otros, hay lugar para
            ti aquí.
          </p>
        </div>

        <div className='mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <JoinButton className='px-7 py-3.5 text-sm' />
        </div>
      </div>
    </section>
  );
}
