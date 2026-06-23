import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export default async function BlogPreview() {
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('id,title,slug,excerpt,cover_image_url,published_at,visibility')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  if (!posts?.length) return null;

  return (
    <section id='blog' className='border-t border-dark/10 bg-cream px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Blog</p>
            <h2 className='mt-4 max-w-3xl font-display text-5xl font-semibold leading-none tracking-tight text-dark md:text-7xl'>
              Lecturas de la comunidad.
            </h2>
          </div>
          <Link
            href='/posts'
            className='inline-flex min-h-11 w-fit items-center gap-2 border border-dark/12 px-4 text-sm font-semibold text-dark/78 transition-colors hover:border-dark/25 hover:text-dark'
          >
            Ver todas
            <ArrowRight className='size-4' />
          </Link>
        </div>

        <div className='mt-10 grid gap-5 md:grid-cols-3'>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className='group border border-dark/10 bg-white/25 transition-colors hover:border-dark/25'
            >
              {post.cover_image_url ? (
                <div className='relative aspect-[16/10] overflow-hidden border-b border-dark/10'>
                  <Image
                    src={post.cover_image_url}
                    alt=''
                    fill
                    sizes='(min-width: 768px) 33vw, 100vw'
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
                <p className='mt-3 text-sm leading-6 text-dark/65'>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisibilityBadge({ visibility }: { visibility: string | null }) {
  const membersOnly = visibility === 'members_only';

  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2 text-xs font-semibold uppercase tracking-[0.14em] ${
        membersOnly
          ? 'border-olive/25 bg-olive/10 text-olive'
          : 'border-dark/12 bg-cream text-dark/62'
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
