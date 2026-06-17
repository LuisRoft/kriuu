import Link from 'next/link';

export default function NoAccess() {
  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <div className='mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col justify-center'>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Acceso</p>
        <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
          No tienes permisos para acceder a esta sección.
        </h1>
        <p className='mt-5 text-base leading-7 text-dark/68'>
          Tu cuenta existe, pero no tiene el rol necesario para abrir esta página.
        </p>
        <Link
          href='/dashboard'
          className='mt-8 inline-flex min-h-11 w-fit items-center rounded-none bg-olive px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90'
        >
          Ir a la plataforma
        </Link>
      </div>
    </main>
  );
}
