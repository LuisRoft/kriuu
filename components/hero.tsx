import Image from 'next/image';
import heroIllustration from '@/public/bgs/hero-illustration.webp';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className='relative min-h-svh w-full overflow-hidden xl:h-svh'>
      <Image
        src={heroIllustration}
        alt=''
        fill
        sizes='100vw'
        className='pointer-events-none object-cover object-[85%_center] md:object-right'
        priority
      />

      <div className='relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-5 px-5 pt-28 md:gap-7 md:px-8 xl:justify-center xl:pt-14'>
        <h1 className='max-w-5xl font-display text-4xl font-semibold leading-none tracking-tight text-dark sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:max-w-7xl 2xl:text-9xl'>
          No importa desde dónde
        </h1>

        <p className='max-w-md text-base font-normal leading-relaxed text-dark/80 md:max-w-xl md:text-xl 2xl:text-2xl'>
          La crew de <span className='italic'>engineers</span>,{' '}
          <span className='italic'>designers</span> y{' '}
          <span className='italic'>founders</span> construyendo desde Latam.
        </p>

        <div className='flex flex-col gap-3'>
          <Button
            className='group/button h-auto w-fit gap-2 px-5 py-3 text-sm font-semibold md:px-8 md:py-4 md:text-lg'
            size='lg'
            asChild
          >
            <Link
              href='https://chat.whatsapp.com/CizNIkE9F5Y5L66E24KJD6?mode=gi_t'
              target='_blank'
              rel='noopener noreferrer'
            >
              Únete a la kriuu
              <ArrowRight className='size-4 transition-transform duration-200 group-hover/button:translate-x-1 md:size-5' />
            </Link>
          </Button>
          <p className='text-xs text-dark/60 md:text-sm'>
            Nació en Manabí, Ecuador. Es para todos.
          </p>
        </div>
      </div>
    </section>
  );
}
