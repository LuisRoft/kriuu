import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '#manifiesto', label: 'Manifiesto' },
  { href: '#directory', label: 'Directory' },
] as const;

export default function SiteHeader() {
  return (
    <header className='fixed left-0 right-0 top-0 z-[999] border-b border-dark/10 bg-cream/90 backdrop-blur-md'>
      <div className='mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 md:px-8'>
        <Link href='#' className='flex shrink-0 items-center gap-2'>
          <Image src='/logo.svg' alt='kriuu' width={28} height={28} />
          <span className='font-display text-lg font-semibold tracking-tight text-dark'>
            kriuu.
          </span>
        </Link>

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

        <Button className='py-4.5 px-4 text-sm' asChild>
          <Link href='#join'>Únete</Link>
        </Button>
      </div>
    </header>
  );
}
