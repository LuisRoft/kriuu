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
    const referrer = document.referrer;

    if (referrer) {
      try {
        if (new URL(referrer).origin === window.location.origin) {
          router.back();
          return;
        }
      } catch {
        // A malformed referrer should use the explicit fallback below.
      }
    }

    router.replace(fallbackHref);
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
