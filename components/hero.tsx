import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '#manifiesto', label: 'Manifiesto' },
  { href: '#ecosistema', label: 'Ecosistema' },
] as const;

export default function Hero() {
  return (
    <section className='relative h-dvh w-full overflow-hidden'>
      <Image
        src='/bgs/hero-illustration.png'
        alt=''
        fill
        className='pointer-events-none object-cover object-[85%_center] md:object-right'
        priority
      />

      <div className='relative z-10 flex items-center justify-between px-5 pt-8 opacity-80 md:px-12 md:pt-14 lg:px-48'>
        <Link href='#'>
          <Image src='/logo.svg' alt='kriuu' width={32} height={32} />
        </Link>
        <nav className='flex items-center gap-4 md:gap-8'>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className='hidden text-sm font-medium text-dark transition-opacity hover:opacity-70 md:block'
            >
              {label}
            </Link>
          ))}
          <Button size='default' asChild>
            <Link href='#join'>Join us</Link>
          </Button>
        </nav>
      </div>

      <div className='relative z-10 flex flex-col gap-5 px-5 pt-24 md:gap-7 md:px-12 md:pt-40 lg:px-48 lg:pt-30'>
        <h1 className='max-w-5xl font-display text-4xl font-semibold leading-none tracking-tight text-dark sm:text-5xl md:text-8xl lg:text-9xl 2xl:max-w-7xl 2xl:text-[11rem]'>
          No importa desde dónde
        </h1>

        <p className='max-w-md text-base font-normal leading-relaxed text-dark/70 md:max-w-xl md:text-xl 2xl:text-2xl'>
          La crew de <span className='italic '>engineers</span>,{' '}
          <span className='italic '>designers</span> y{' '}
          <span className='italic '>founders</span> construyendo desde Latam.
        </p>

        <Button
          className='h-auto w-fit gap-2 px-4 py-2 text-sm font-semibold md:px-8 md:py-4 md:text-xl'
          size='lg'
          asChild
        >
          <Link href='#join'>Join us</Link>
        </Button>
      </div>

      {/* Bottom fade into next section */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-b from-transparent to-white md:h-48' />
    </section>
  );
}
