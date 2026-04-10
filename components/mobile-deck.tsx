'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import MemberPhoto from './member-photo';
import { MEMBERS } from '@/lib/members';

gsap.registerPlugin(useGSAP);

const STACK_OFFSET = 10;
const SCALE_STEP   = 0.03;
const VISIBLE      = 3;

export default function MobileDeck() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const idxRef     = useRef(0);
  const advanceRef = useRef<() => void>(() => {});
  const backRef    = useRef<() => void>(() => {});
  const [idx, setIdx] = useState(0);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-deck-card]', wrapRef.current);

      // Initial stack layout
      cards.forEach((card, i) => {
        gsap.set(card, {
          y: Math.min(i, VISIBLE) * STACK_OFFSET,
          scale: 1 - Math.min(i, VISIBLE) * SCALE_STEP,
          zIndex: MEMBERS.length - i,
          autoAlpha: i < VISIBLE ? 1 : 0,
        });
      });

      advanceRef.current = () => {
        const i = idxRef.current;
        if (i >= MEMBERS.length - 1) return;

        gsap.to(cards[i], {
          y: -200,
          rotation: gsap.utils.random(-14, 14),
          autoAlpha: 0,
          duration: 0.32,
          ease: 'power2.in',
        });

        for (let j = i + 1; j < MEMBERS.length; j++) {
          const pos = j - i - 1;
          gsap.to(cards[j], {
            y: Math.min(pos, VISIBLE) * STACK_OFFSET,
            scale: 1 - Math.min(pos, VISIBLE) * SCALE_STEP,
            autoAlpha: pos < VISIBLE ? 1 : 0,
            duration: 0.38,
            ease: 'power2.out',
            delay: 0.06,
          });
        }

        idxRef.current = i + 1;
        setIdx(i + 1);
      };

      backRef.current = () => {
        const i = idxRef.current;
        if (i <= 0) return;

        gsap.fromTo(
          cards[i - 1],
          { y: -200, autoAlpha: 0, rotation: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: 'power2.out' },
        );

        for (let j = i; j < MEMBERS.length; j++) {
          const pos = j - i + 1;
          gsap.to(cards[j], {
            y: Math.min(pos, VISIBLE) * STACK_OFFSET,
            scale: 1 - Math.min(pos, VISIBLE) * SCALE_STEP,
            autoAlpha: pos < VISIBLE ? 1 : 0,
            duration: 0.38,
            ease: 'power2.out',
            delay: 0.04,
          });
        }

        idxRef.current = i - 1;
        setIdx(i - 1);
      };
    },
    { scope: wrapRef },
  );

  return (
    <div className='mt-16 md:hidden'>
      <div className='mb-5 flex items-center justify-between'>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/40'>
          {idx + 1} / {MEMBERS.length}
        </p>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => backRef.current()}
            disabled={idx === 0}
            className='flex size-11 items-center justify-center border border-dark/12 text-dark/50 transition-colors hover:text-dark disabled:opacity-20'
            aria-label='Anterior'
          >
            ←
          </button>
          <button
            onClick={() => advanceRef.current()}
            disabled={idx === MEMBERS.length - 1}
            className='flex size-11 items-center justify-center border border-dark/12 text-dark/50 transition-colors hover:text-dark disabled:opacity-20'
            aria-label='Siguiente'
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className='relative mx-auto w-full max-w-sm'
        style={{ height: 400 }}
      >
        {MEMBERS.map(({ name, role, desc, photo, linkedin }) => (
          <div
            key={name}
            data-deck-card
            className='absolute inset-x-0 top-0 border border-dark/8 bg-cream'
          >
            <MemberPhoto src={photo} name={name} className='h-48' />
            <div className='p-5'>
              <p className='text-[15px] font-semibold text-dark'>{name}</p>
              {role && (
                <p className='mt-0.5 text-xs font-medium uppercase tracking-wider text-dark/50'>
                  {role}
                </p>
              )}
              {desc && (
                <p className='mt-2 text-sm leading-relaxed text-dark/60'>{desc}</p>
              )}
              {linkedin && (
                <Link
                  href={linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-3 inline-block text-[11px] font-medium text-dark/40 transition-colors hover:text-dark'
                >
                  LinkedIn ↗
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
