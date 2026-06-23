import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, PenLine } from 'lucide-react';
import BackButton from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { isMember } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { siteDescription, siteKeywords, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog de tecnología, IA y comunidad',
  description:
    'Lecturas de Kriuu sobre tecnología, inteligencia artificial, ética tecnológica, diseño, emprendimiento y comunidad tech desde Latam.',
  keywords: siteKeywords,
  alternates: {
    canonical: '/posts',
  },
  openGraph: {
    title: 'Blog de Kriuu | Tecnología, IA y ética tech',
    description: siteDescription,
    url: `${siteUrl}/posts`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Kriuu | Tecnología, IA y ética tech',
    description: siteDescription,
  },
};

export default async function PostsPage() {
  const { roles, isActive } = await getCurrentSessionUser();
  const canCreatePost = isActive && isMember(roles);

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('id,title,slug,excerpt,cover_image_url,published_at,author_id,visibility')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  const postIds = posts?.map((post) => post.id) ?? [];
  const [{ data: votes }, { data: comments }] = postIds.length
    ? await Promise.all([
        supabaseAdmin.from('post_votes').select('post_id').in('post_id', postIds),
        supabaseAdmin
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)
          .eq('status', 'published'),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <div className='mx-auto max-w-6xl'>
        <header className='flex flex-col gap-4 border-b border-dark/10 pb-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='mb-6'>
              <BackButton fallbackHref='/' label='Volver' />
            </div>
            <div>
              <Link href='/' className='font-display text-2xl font-semibold tracking-tight'>
                kriuu.
              </Link>
              <p className='mt-1 text-sm text-dark/60'>Publicaciones</p>
            </div>
          </div>
          {canCreatePost ? (
            <Button asChild className='h-auto w-fit gap-2 px-5 py-3 text-sm'>
              <Link href='/posts/nuevo'>
                <PenLine className='size-4' />
                Crear publicación
              </Link>
            </Button>
          ) : (
            <Button asChild className='h-auto w-fit gap-2 px-5 py-3 text-sm' variant='outline'>
              <Link href='/login'>
                <LogIn className='size-4' />
                Iniciar sesión
              </Link>
            </Button>
          )}
        </header>

        <section className='py-10'>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Lecturas</p>
          <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight md:text-7xl'>
            Ideas de la comunidad.
          </h1>
          <div className='mt-8 grid gap-5 md:grid-cols-2'>
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className='group border border-dark/10 bg-white/25 transition-colors hover:border-dark/25'
              >
                {post.cover_image_url ? (
                  <div className='relative aspect-[16/9] overflow-hidden border-b border-dark/10'>
                    <Image
                      src={post.cover_image_url}
                      alt=''
                      fill
                      sizes='(min-width: 768px) 50vw, 100vw'
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
                  <h2 className='mt-3 font-display text-3xl font-semibold leading-none'>
                    {post.title}
                  </h2>
                  <p className='mt-3 text-sm leading-6 text-dark/65'>{post.excerpt}</p>
                  <p className='mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>
                    {countByPost(votes, post.id)} upvotes · {countByPost(comments, post.id)} comentarios
                  </p>
                </div>
              </Link>
            ))}
            {!posts?.length ? (
              <p className='border border-dark/10 bg-white/25 p-5 text-sm text-dark/62'>
                Todavía no hay publicaciones aprobadas.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function countByPost(items: { post_id: string }[] | null, postId: string) {
  return items?.filter((item) => item.post_id === postId).length ?? 0;
}

function VisibilityBadge({ visibility }: { visibility: string | null }) {
  const membersOnly = visibility === 'members_only';

  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2 text-xs font-semibold uppercase tracking-[0.14em] ${
        membersOnly
          ? 'border-olive/25 bg-olive/10 text-olive'
          : 'border-dark/12 bg-white/40 text-dark/62'
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
