'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({
  fallbackHref,
  label = 'Volver',
}: {
  fallbackHref: string;
  label?: string;
}) {
  const router = useRouter();

  function goBack() {
    const previousPath = sessionStorage.getItem('kriuu:previous-path');
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (previousPath && previousPath !== currentPath) {
      router.push(previousPath);
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      type='button'
      onClick={goBack}
      className='inline-flex min-h-10 items-center gap-2 border border-dark/12 px-3 text-sm font-semibold text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
    >
      <ArrowLeft className='size-4' />
      {label}
    </button>
  );
}
