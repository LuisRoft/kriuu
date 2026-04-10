'use client';

import Image from 'next/image';
import { useState } from 'react';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function MemberPhoto({
  src,
  name,
  className,
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const showPlaceholder = !src || error;

  return (
    <div className={`relative overflow-hidden bg-dark/6 ${className ?? ''}`}>
      {showPlaceholder ? (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='font-display text-2xl font-semibold text-dark/20'>
            {initials(name)}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={name}
          fill
          className={`object-cover object-top transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
        />
      )}
    </div>
  );
}
