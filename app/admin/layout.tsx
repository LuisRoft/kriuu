import Link from 'next/link';
import type { ReactNode } from 'react';
import SignOutButton from '@/components/sign-out-button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <div className='mx-auto max-w-7xl'>
        <header className='flex flex-col gap-5 border-b border-dark/10 pb-5 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <Link href='/' className='font-display text-2xl font-semibold tracking-tight'>
              kriuu.
            </Link>
            <p className='mt-1 text-sm text-dark/60'>Panel administrativo</p>
          </div>
          <nav className='flex flex-wrap items-center gap-3 text-sm font-medium text-dark/65'>
            <Link className='transition-colors hover:text-dark' href='/admin'>
              Inicio
            </Link>
            <Link className='transition-colors hover:text-dark' href='/admin/postulaciones'>
              Postulaciones
            </Link>
            <Link className='transition-colors hover:text-dark' href='/admin/usuarios'>
              Usuarios
            </Link>
            <Link className='transition-colors hover:text-dark' href='/admin/posts'>
              Posts
            </Link>
            <Link className='transition-colors hover:text-dark' href='/posts'>
              Lecturas
            </Link>
            <Link className='transition-colors hover:text-dark' href='/cuenta'>
              Cuenta
            </Link>
            <SignOutButton className='h-auto gap-2 px-4 py-2.5 text-sm' />
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
