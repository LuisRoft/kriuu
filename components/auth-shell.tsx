import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <div className='mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col'>
        <header className='flex items-center justify-between border-b border-dark/10 pb-5'>
          <Link href='/' className='font-display text-2xl font-semibold tracking-tight'>
            kriuu.
          </Link>
          <Link
            href='/'
            className='text-sm font-medium text-dark/65 transition-colors hover:text-dark'
          >
            Volver al sitio
          </Link>
        </header>

        <div className='grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr]'>
          <section>
            <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>{eyebrow}</p>
            <h1 className='mt-4 max-w-xl font-display text-5xl font-semibold leading-none tracking-tight text-dark md:text-7xl'>
              {title}
            </h1>
            <p className='mt-6 max-w-xl text-base leading-7 text-dark/68'>{description}</p>
          </section>
          {children}
        </div>
      </div>
    </main>
  );
}
