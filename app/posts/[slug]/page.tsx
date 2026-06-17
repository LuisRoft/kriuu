import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import { notFound } from 'next/navigation';
import AdminPostActions from '@/components/admin-post-actions';
import BackButton from '@/components/back-button';
import PostEngagement from '@/components/post-engagement';
import { isAdmin, isMember } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { siteKeywords, siteName, siteUrl } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('title,excerpt,slug,cover_image_url,published_at,updated_at,visibility')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!post) {
    return {
      title: 'Publicación no encontrada',
      robots: { index: false, follow: false },
    };
  }

  const title = post.title;
  const description =
    post.visibility === 'members_only'
      ? `${post.excerpt} Lectura disponible para miembros de Kriuu.`
      : post.excerpt;
  const url = `${siteUrl}/posts/${post.slug}`;

  return {
    title,
    description,
    keywords: siteKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      images: post.cover_image_url
        ? [
            {
              url: post.cover_image_url,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [{ url: '/api/og', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : ['/api/og'],
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { user, roles, isActive } = await getCurrentSessionUser();

  const { slug } = await params;
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!post) notFound();

  const { data: author } = await supabaseAdmin
    .from('profiles')
    .select('display_name,nombres,apellidos')
    .eq('id', post.author_id)
    .maybeSingle();
  const { data: approver } = post.approved_by
    ? await supabaseAdmin
        .from('profiles')
        .select('display_name,nombres,apellidos')
        .eq('id', post.approved_by)
        .maybeSingle()
    : { data: null };
  const authorName =
    author?.display_name || [author?.nombres, author?.apellidos].filter(Boolean).join(' ') || 'Kriuu';
  const approverName =
    approver?.display_name ||
    [approver?.nombres, approver?.apellidos].filter(Boolean).join(' ') ||
    'Equipo Kriuu';
  const canReadPost = post.visibility !== 'members_only' || (isActive && isMember(roles));
  const canEngage = Boolean(user && isActive && isMember(roles));
  const { count: voteCount } = await supabaseAdmin
    .from('post_votes')
    .select('post_id', { count: 'exact', head: true })
    .eq('post_id', post.id);
  const [{ data: userVote }, { data: comments }] =
    canEngage && canReadPost
      ? await Promise.all([
          supabaseAdmin
            .from('post_votes')
            .select('post_id')
            .eq('post_id', post.id)
            .eq('user_id', user?.id)
            .maybeSingle(),
          supabaseAdmin
            .from('comments')
            .select('id,content,created_at,edited_at,user_id')
            .eq('post_id', post.id)
            .eq('status', 'published')
            .order('created_at', { ascending: true }),
        ])
      : [{ data: null }, { data: [] }];
  const commenterIds = Array.from(new Set(comments?.map((comment) => comment.user_id) ?? []));
  const { data: commenterProfiles } = commenterIds.length
    ? await supabaseAdmin
        .from('profiles')
        .select('id,display_name,nombres,apellidos')
        .in('id', commenterIds)
    : { data: [] };

  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            url: `${siteUrl}/posts/${post.slug}`,
            datePublished: post.published_at,
            dateModified: post.updated_at ?? post.published_at,
            image: post.cover_image_url ? [post.cover_image_url] : undefined,
            author: {
              '@type': 'Person',
              name: authorName,
              url: `${siteUrl}/miembros/${post.author_id}`,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Kriuu',
              url: siteUrl,
            },
            isAccessibleForFree: post.visibility !== 'members_only',
            keywords: siteKeywords.join(', '),
          }),
        }}
      />
      <article className='mx-auto max-w-4xl'>
        <div className='mb-8'>
          <BackButton fallbackHref='/posts' label='Volver' />
        </div>
        <header className='py-10'>
          <div className='flex flex-wrap items-center gap-2'>
            <VisibilityBadge visibility={post.visibility} />
            <span className='text-xs font-medium uppercase tracking-widest text-dark/45'>
              <Link href={`/miembros/${post.author_id}`} className='transition-opacity hover:opacity-60'>
                {authorName}
              </Link>{' '}
              · {formatDate(post.published_at)}
            </span>
          </div>
          <p className='mt-3 text-sm leading-6 text-dark/62'>
            Aprobado por{' '}
            {post.approved_by ? (
              <Link
                href={`/miembros/${post.approved_by}`}
                className='font-semibold text-dark/72 transition-opacity hover:opacity-60'
              >
                {approverName}
              </Link>
            ) : (
              approverName
            )}{' '}
            el {formatDate(post.approved_at)}.
          </p>
          <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight md:text-7xl'>
            {post.title}
          </h1>
          <p className='mt-6 text-lg leading-8 text-dark/68'>{post.excerpt}</p>
        </header>
        {post.cover_image_url ? (
          <div className='relative mb-10 min-h-[320px] overflow-hidden md:min-h-[520px]'>
            <Image src={post.cover_image_url} alt='' fill sizes='100vw' className='object-contain' />
          </div>
        ) : null}
        {canReadPost ? (
          <>
            <div className='whitespace-pre-wrap border-t border-dark/10 py-8 text-base leading-8 text-dark/78'>
              {post.content}
            </div>
            {isAdmin(roles) ? (
              <div className='mb-8'>
                <AdminPostActions postId={post.id} status={post.status} />
              </div>
            ) : null}
          </>
        ) : (
          <div className='border-t border-dark/10 py-8'>
            <div className='border border-dark/10 bg-white/25 p-5 md:p-7'>
              <div className='flex size-12 items-center justify-center border border-olive/25 bg-olive/10 text-olive'>
                <Lock className='size-5' />
              </div>
              <h2 className='mt-5 font-display text-3xl font-semibold leading-none text-dark'>
                Esta lectura es para miembros.
              </h2>
              <p className='mt-4 max-w-2xl text-sm leading-7 text-dark/68'>
                Puedes ver que existe, pero para leerla completa necesitas una cuenta aprobada de Kriuu. Inicia sesión si ya perteneces a la comunidad o solicita unirte.
              </p>
              <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
                <Link
                  href='/login'
                  className='inline-flex min-h-11 items-center justify-center gap-2 bg-olive px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90'
                >
                  <LogIn className='size-4' />
                  Iniciar sesión
                </Link>
                <Link
                  href='/?join=1'
                  className='inline-flex min-h-11 items-center justify-center gap-2 border border-dark/12 px-5 text-sm font-semibold text-dark/78 transition-colors hover:border-dark/25 hover:text-dark'
                >
                  <UserPlus className='size-4' />
                  Solicitar unirme
                </Link>
              </div>
            </div>
          </div>
        )}
        {canEngage && canReadPost ? (
          <PostEngagement
            postId={post.id}
            voteCount={voteCount ?? 0}
            hasVoted={Boolean(userVote)}
            comments={
              comments?.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at,
                editedAt: comment.edited_at,
                authorName: getCommentAuthorName(commenterProfiles, comment.user_id),
                canEdit: comment.user_id === user?.id,
                canDelete: comment.user_id === user?.id || isAdmin(roles),
              })) ?? []
            }
          />
        ) : canReadPost ? (
          <div className='border-t border-dark/10 py-8'>
            <div className='border border-dark/10 bg-white/25 p-5 text-sm leading-6 text-dark/68'>
              {voteCount ?? 0} upvotes. Para votar o comentar, inicia sesión con tu cuenta de Kriuu.
            </div>
          </div>
        ) : null}
      </article>
    </main>
  );
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

function getCommentAuthorName(
  profiles:
    | {
        id: string;
        display_name: string | null;
        nombres: string | null;
        apellidos: string | null;
      }[]
    | null,
  userId: string,
) {
  const profile = profiles?.find((item) => item.id === userId);

  return (
    profile?.display_name ||
    [profile?.nombres, profile?.apellidos].filter(Boolean).join(' ') ||
    'Miembro Kriuu'
  );
}
