'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import JoinButton from '@/components/join-button';
import SignOutButton from '@/components/sign-out-button';

const NAV_LINKS = [
  { href: '#manifiesto', label: 'Manifiesto' },
  { href: '#codigo-de-conducta', label: 'Código' },
  { href: '#team', label: 'Team' },
  { href: '/posts', label: 'Blog' },
  { href: '/login', label: 'Acceso' },
] as const;

export default function SiteHeader({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false);
  const navLinks = isAuthenticated
    ? NAV_LINKS.filter((link) => link.href !== '/login')
    : NAV_LINKS;

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
          {navLinks.map(({ href, label }) => (
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
          {isAuthenticated ? (
            <SignOutButton className='hidden min-h-11 items-center gap-2 border border-dark/12 bg-transparent px-4 text-sm font-semibold text-dark/78 transition-colors hover:border-dark/25 hover:bg-transparent hover:text-dark sm:inline-flex' />
          ) : (
            <>
              <Link
                href='/login'
                className='hidden min-h-11 items-center border border-dark/12 px-4 text-sm font-semibold text-dark/78 transition-colors hover:border-dark/25 hover:text-dark sm:inline-flex'
              >
                Iniciar sesión
              </Link>
              <JoinButton className='min-h-11 px-4 text-sm' iconClassName='hidden' size='default'>
                Únete
              </JoinButton>
            </>
          )}

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
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className='flex min-h-11 items-center text-sm font-medium text-dark/70 transition-opacity hover:opacity-60'
              >
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <SignOutButton className='mt-2 flex min-h-11 w-full items-center justify-center gap-2 border border-dark/12 bg-transparent px-4 text-sm font-semibold text-dark/78 transition-colors hover:border-dark/25 hover:bg-transparent hover:text-dark' />
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
}
