'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, useGSAP);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(h1Ref.current!, { type: 'chars, words' });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(split.chars, {
        y: 100,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.05,
      })
        .from(
          paraRef.current,
          { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.4',
        )
        .from(
          ctaRef.current,
          { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4',
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className='relative h-dvh w-full overflow-hidden'
    >
      <Image
        src='/bgs/hero-illustration.png'
        alt=''
        fill
        className='pointer-events-none object-cover object-[85%_center] md:object-right'
        priority
      />

      <div className='relative z-10 mx-auto flex h-full w-full max-w-[1280px] flex-col gap-5 px-5 pt-28 md:gap-7 md:px-8 xl:justify-center xl:pt-14'>
        <h1
          ref={h1Ref}
          className='max-w-5xl font-display text-4xl font-semibold leading-none tracking-tight text-dark sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:max-w-7xl 2xl:text-9xl'
        >
          No importa desde dónde
        </h1>

        <p
          ref={paraRef}
          className='max-w-md text-base font-normal leading-relaxed text-dark/70 md:max-w-xl md:text-xl 2xl:text-2xl'
        >
          La crew de <span className='italic'>engineers</span>,{' '}
          <span className='italic'>designers</span> y{' '}
          <span className='italic'>founders</span> construyendo desde Latam.
        </p>

        <div
          ref={ctaRef}
          className='flex flex-col gap-3'
        >
          <Button
            className='group h-auto w-fit gap-2 px-5 py-3 text-sm font-semibold md:px-8 md:py-4 md:text-lg'
            size='lg'
            asChild
          >
            <Link href='#join'>
              Únete a la kriuu
              <ArrowRight className='size-4 transition-transform duration-200 group-hover/button:translate-x-1 md:size-5' />
            </Link>
          </Button>
          <p className='text-xs text-dark/50 md:text-sm'>
            Nació en Manabí, Ecuador. Es para todos.
          </p>
        </div>
      </div>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-b from-transparent to-cream md:h-48' />
    </section>
  );
}
