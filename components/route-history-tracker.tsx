'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteHistoryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const currentPath = query ? `${pathname}?${query}` : pathname;
    const storedCurrentPath = sessionStorage.getItem('kriuu:current-path');

    if (storedCurrentPath && storedCurrentPath !== currentPath) {
      sessionStorage.setItem('kriuu:previous-path', storedCurrentPath);
    }

    sessionStorage.setItem('kriuu:current-path', currentPath);
  }, [pathname, searchParams]);

  return null;
}
