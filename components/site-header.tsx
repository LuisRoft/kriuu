'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import JoinButton from '@/components/join-button';

const NAV_LINKS = [
  { href: '#manifiesto', label: 'Manifiesto' },
  { href: '#team', label: 'Team' },
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className='fixed left-0 right-0 top-0 z-999 border-b border-dark/10 bg-cream/96 md:bg-cream/90 md:backdrop-blur-md'>
      <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8'>
        {/* Logo */}
        <Link href='#' className='flex shrink-0 items-center gap-2'>
          <Image src='/logo.svg' alt='kriuu' width={28} height={28} />
          <span className='hidden font-display text-lg font-semibold tracking-tight text-dark md:block'>
            kriuu.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className='absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex'>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className='text-sm font-medium text-dark/70 transition-opacity hover:opacity-60'
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className='flex items-center gap-2'>
          <JoinButton className='min-h-11 px-4 text-sm' iconClassName='hidden' size='default'>
            Únete
          </JoinButton>

          {/* Hamburger — mobile only */}
          <button
            className='flex size-11 items-center justify-center text-dark md:hidden'
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className='size-5' /> : <Menu className='size-5' />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className='border-t border-dark/8 bg-cream/98 md:hidden'>
          <div className='mx-auto max-w-7xl px-5 py-2'>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className='flex min-h-11 items-center text-sm font-medium text-dark/70 transition-opacity hover:opacity-60'
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
