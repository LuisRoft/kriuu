'use client';

import Image from 'next/image';
import heroIllustration from '@/public/bgs/hero-illustration.webp';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Parallax: el wrapper es 30% más alto que la sección,
      // arranca desplazado arriba (-15%) y baja mientras scrolleas.
      // La sección tiene overflow-hidden así que el exceso se corta.
      gsap.to(parallaxRef.current, {
        yPercent: 15,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      if (!h1Ref.current) return;
      const split = SplitText.create(h1Ref.current, {
        type: 'chars',
        smartWrap: true,
      });

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

      return () => split.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className='relative h-dvh w-full overflow-hidden'
    >
      {/* Wrapper 30% más alto: arranca 15% arriba del borde de la sección */}
      <div
        ref={parallaxRef}
        className='absolute inset-x-0 -top-[15%] bottom-0 will-change-transform'
      >
        <Image
          src={heroIllustration}
          placeholder='blur'
          alt=''
          fill
          className='pointer-events-none object-cover object-[85%_center] md:object-right'
          priority
        />
      </div>

      <div className='relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-5 px-5 pt-28 md:gap-7 md:px-8 xl:justify-center xl:pt-14'>
        <h1
          ref={h1Ref}
          className='max-w-5xl font-display text-4xl font-semibold leading-none tracking-tight text-dark sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:max-w-7xl 2xl:text-9xl'
        >
          No importa desde dónde
        </h1>

        <p
          ref={paraRef}
          className='max-w-md text-base font-normal leading-relaxed text-dark/80 md:max-w-xl md:text-xl 2xl:text-2xl'
        >
          La crew de <span className='italic'>engineers</span>,{' '}
          <span className='italic'>designers</span> y{' '}
          <span className='italic'>founders</span> construyendo desde Latam.
        </p>

        <div ref={ctaRef} className='flex flex-col gap-3'>
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
