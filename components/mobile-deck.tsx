'use client';

import { useState } from 'react';
import Link from 'next/link';
import MemberPhoto from './member-photo';
import { MEMBERS } from '@/lib/members';

export default function MobileDeck() {
  const [idx, setIdx] = useState(0);

  return (
    <div className='mt-16 md:hidden'>
      <div className='mb-5 flex items-center justify-between'>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/40'>
          {idx + 1} / {MEMBERS.length}
        </p>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className='flex size-11 items-center justify-center border border-dark/12 text-dark/50 transition-colors hover:text-dark disabled:opacity-20'
            aria-label='Anterior'
          >
            ←
          </button>
          <button
            onClick={() => setIdx((i) => Math.min(MEMBERS.length - 1, i + 1))}
            disabled={idx === MEMBERS.length - 1}
            className='flex size-11 items-center justify-center border border-dark/12 text-dark/50 transition-colors hover:text-dark disabled:opacity-20'
            aria-label='Siguiente'
          >
            →
          </button>
        </div>
      </div>

      <div className='relative mx-auto w-full max-w-sm'>
        {MEMBERS.map(({ name, role, desc, photo, linkedin }, i) => {
          const pos = i - idx;
          const visible = pos >= 0 && pos <= 2;

          return (
            <div
              key={name}
              className='inset-x-0 top-0 border border-dark/8 bg-cream transition-all duration-300'
              style={{
                position: pos === 0 ? 'relative' : 'absolute',
                transform: `translateY(${Math.min(pos, 2) * 10}px) scale(${1 - Math.min(Math.max(pos, 0), 2) * 0.03})`,
                zIndex: MEMBERS.length - i,
                opacity: visible ? 1 : 0,
                pointerEvents: pos === 0 ? 'auto' : 'none',
              }}
            >
              <div className='p-5'>
                {/* Top row: foto + nombre/título */}
                <div className='flex items-start gap-4'>
                  <MemberPhoto
                    src={photo}
                    name={name}
                    className='aspect-square w-24 flex-shrink-0'
                  />
                  <div className='min-w-0 pt-1'>
                    <p className='text-[15px] font-semibold text-dark'>{name}</p>
                    {role && (
                      <p className='mt-0.5 text-xs font-medium uppercase tracking-wider text-dark/50'>
                        {role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                {desc && (
                  <p className='mt-4 text-sm leading-relaxed text-dark/60'>{desc}</p>
                )}

                {/* Redes sociales — bottom right */}
                {linkedin && (
                  <div className='mt-4 flex justify-end'>
                    <Link
                      href={linkedin}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[11px] font-medium text-dark/40 transition-colors hover:text-dark'
                    >
                      LinkedIn ↗
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
