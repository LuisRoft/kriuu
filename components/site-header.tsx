'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#manifiesto', label: 'Manifiesto' },
  { href: '#ecosistema', label: 'Ecosistema' },
] as const;

export default function SiteHeader() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = NAV_LINKS.map(({ href }) =>
      document.querySelector(href)
    ).filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      setVisible(window.scrollY > 200);

      let current = '';
      for (const section of sections) {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
          current = `#${section.id}`;
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-999 px-5 py-4 md:px-12 lg:px-48',
        'transition-all duration-500 ease-out',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      <div className='flex items-center justify-between border border-dark/8 bg-white/70 px-5 py-2.5 shadow-lg shadow-dark/5 backdrop-blur-xl'>
        <Link href='#'>
          <Image src='/logo.svg' alt='kriuu' width={24} height={24} />
        </Link>
        <nav className='flex items-center gap-4 md:gap-6'>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'hidden text-sm font-medium text-dark transition-all hover:opacity-70 md:block',
                activeSection === href
                  ? 'underline underline-offset-4'
                  : 'no-underline',
              )}
            >
              {label}
            </Link>
          ))}
          <Button size='sm' asChild>
            <Link href='#join'>Join us</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
