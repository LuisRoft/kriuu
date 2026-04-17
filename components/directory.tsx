import Link from 'next/link';
import MemberPhoto from './member-photo';
import MobileDeck from './mobile-deck';
import { MEMBERS } from '@/lib/members';

export default function Directory() {
  return (
    <section
      id='team'
      className='border-t border-dark/8 bg-cream py-16 md:py-30'
    >
      <div className='mx-auto max-w-7xl px-5 md:px-8'>
        <div className='mx-auto max-w-190'>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/50'>
            Team
          </p>
          <div className='mt-10 space-y-4 text-[17px] leading-[1.7] text-dark'>
            <p>
              Estas son las personas que están construyendo Kriuu desde el
              inicio, los que llegaron antes de que hubiera razones obvias para
              llegar.
            </p>
          </div>
        </div>

        {/* Desktop — grilla */}
        <div className='mt-16 hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3'>
          {MEMBERS.map(({ name, role, desc, photo, linkedin }) => (
            <article
              key={name}
              className='flex flex-col border border-dark/8 bg-cream p-5'
            >
              {/* Top row: foto + nombre/título */}
              <div className='flex items-start gap-4'>
                <MemberPhoto
                  src={photo}
                  name={name}
                  className='aspect-square w-24 shrink-0'
                />
                <div className='min-w-0 pt-1'>
                  <p className='text-sm font-semibold text-dark'>{name}</p>
                  {role && (
                    <p className='mt-0.5 text-[11px] font-medium uppercase tracking-wider text-dark/50'>
                      {role}
                    </p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              {desc && (
                <p className='mt-4 text-xs leading-relaxed text-dark/60'>
                  {desc}
                </p>
              )}

              {/* Redes sociales — bottom right */}
              {linkedin && (
                <div className='mt-4 flex flex-1 items-end justify-end'>
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
            </article>
          ))}
        </div>

        <MobileDeck />
      </div>
    </section>
  );
}
