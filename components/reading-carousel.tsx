'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  visibility: string | null;
};

export default function ReadingCarousel({ posts }: { posts: Post[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    carouselRef.current?.scrollBy({
      left: direction * Math.max(carouselRef.current.clientWidth * 0.85, 280),
      behavior: 'smooth',
    });
  }

  return (
    <>
      <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
        <div>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Blog</p>
          <h2 className='mt-4 max-w-3xl font-display text-5xl font-semibold leading-none tracking-tight text-dark md:text-7xl'>
            Lecturas de la comunidad.
          </h2>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() => move(-1)}
            aria-label='Ver lecturas anteriores'
            className='inline-flex size-11 items-center justify-center border border-dark/12 text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
          >
            <ArrowLeft className='size-4' />
          </button>
          <button
            type='button'
            onClick={() => move(1)}
            aria-label='Ver más lecturas'
            className='inline-flex size-11 items-center justify-center border border-dark/12 text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
          >
            <ArrowRight className='size-4' />
          </button>
          <Link
            href='/posts'
            className='inline-flex min-h-11 items-center gap-2 border border-dark/12 px-4 text-sm font-semibold text-dark/78 transition-colors hover:border-dark/25 hover:text-dark'
          >
            Ver todas
            <ArrowRight className='size-4' />
          </Link>
        </div>
      </div>

      <div
        ref={carouselRef}
        role='region'
        aria-label='Carrusel de lecturas'
        tabIndex={0}
        className='scrollbar-none -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8'
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className='group min-w-[82vw] max-w-[25rem] shrink-0 snap-start border border-dark/10 bg-white/25 transition-colors hover:border-dark/25 sm:min-w-[22rem] md:min-w-[calc((100%_-_2.5rem)/3)]'
          >
            {post.cover_image_url ? (
              <div className='relative aspect-[16/10] overflow-hidden border-b border-dark/10'>
                <Image
                  src={post.cover_image_url}
                  alt=''
                  fill
                  sizes='(min-width: 768px) 33vw, 82vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                />
              </div>
            ) : null}
            <div className='p-5'>
              <div className='flex flex-wrap items-center gap-2'>
                <VisibilityBadge visibility={post.visibility} />
                <span className='text-xs font-medium uppercase tracking-widest text-dark/45'>
                  {formatDate(post.published_at)}
                </span>
              </div>
              <h3 className='mt-4 font-display text-3xl font-semibold leading-none text-dark'>
                {post.title}
              </h3>
              {post.excerpt ? (
                <p className='mt-3 line-clamp-3 text-sm leading-6 text-dark/65'>{post.excerpt}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function VisibilityBadge({ visibility }: { visibility: string | null }) {
  const membersOnly = visibility === 'members_only';

  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2 text-xs font-semibold uppercase tracking-[0.14em] ${
        membersOnly ? 'border-olive/25 bg-olive/10 text-olive' : 'border-dark/12 bg-cream text-dark/62'
      }`}
    >
      {membersOnly ? 'Solo miembros' : 'Para todos'}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return 'Publicado';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}
