'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '#manifiesto', label: 'Manifiesto' },
  { href: '#directory', label: 'Directory' },
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className='fixed left-0 right-0 top-0 z-999 border-b border-dark/10 bg-cream/90 backdrop-blur-md'>
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
          <Button className='h-auto min-h-11 px-4 text-sm' asChild>
            <Link href='#join'>Únete</Link>
          </Button>

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
        <nav className='border-t border-dark/8 bg-cream/95 backdrop-blur-md md:hidden'>
          <div className='mx-auto max-w-[1280px] px-5 py-2'>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className='flex min-h-[44px] items-center text-sm font-medium text-dark/70 transition-opacity hover:opacity-60'
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
