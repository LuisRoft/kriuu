import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import SignOutButton from '@/components/sign-out-button';
import NoAccess from '@/components/no-access';
import { isAdmin } from '@/lib/auth/roles';
import { requirePlatformAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const { user, roles, allowed } = await requirePlatformAccess();

  if (!allowed) return <NoAccess />;

  if (isAdmin(roles)) {
    redirect('/admin');
  }

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name,nombres,apellidos,status,ciudad,carrera')
    .eq('id', user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ?? [profile?.nombres, profile?.apellidos].filter(Boolean).join(' ') ?? user.email;
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('id,title,slug,excerpt,cover_image_url,published_at,visibility')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);
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
            <p className='font-display text-2xl font-semibold tracking-tight'>kriuu.</p>
            <p className='mt-1 text-sm text-dark/60'>Plataforma comunitaria</p>
          </div>
          <SignOutButton className='h-auto w-fit gap-2 px-5 py-3 text-sm' />
        </header>

        <section className='grid gap-8 py-10 lg:grid-cols-[1fr_320px]'>
          <div>
            <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Bienvenida</p>
            <h1 className='mt-4 max-w-3xl font-display text-5xl font-semibold leading-none tracking-tight md:text-7xl'>
              Hola, {displayName}.
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-7 text-dark/68'>
              Bienvenido a la plataforma de Kriuu. Este será tu espacio para participar en la
              comunidad, escribir, comentar y compartir ideas sobre tecnología, ética, filosofía y
              cultura.
            </p>
            <div className='mt-10 flex items-center justify-between gap-4 border-t border-dark/10 pt-8'>
              <h2 className='font-display text-3xl font-semibold'>Publicaciones disponibles</h2>
              <Link href='/posts' className='text-sm font-semibold text-dark/62 hover:text-dark'>
                Ver todo
              </Link>
            </div>
            <div className='mt-5 grid gap-4 md:grid-cols-2'>
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
                  <div className='p-4'>
                    <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>
                      {post.visibility === 'members_only' ? 'Solo miembros' : 'Público'} ·{' '}
                      {formatDate(post.published_at)}
                    </p>
                    <h3 className='mt-3 font-display text-2xl font-semibold leading-none'>
                      {post.title}
                    </h3>
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
          </div>

          <aside className='space-y-4 border border-dark/10 bg-white/30 p-5'>
            <h2 className='font-display text-2xl font-semibold'>Tu cuenta</h2>
            <Info label='Estado' value={String(profile?.status ?? 'active')} />
            <Info label='Roles' value={roles.join(', ') || 'Sin rol'} />
            <Info label='Ciudad' value={String(profile?.ciudad ?? 'Pendiente')} />
            <Info label='Carrera' value={String(profile?.carrera ?? 'Pendiente')} />
            <Link
              href='/posts'
              className='mt-2 flex min-h-11 w-full items-center border border-dark/12 px-4 text-left text-sm font-semibold text-dark/70'
            >
              Leer publicaciones
            </Link>
            <Link
              href='/posts/nuevo'
              className='mt-2 flex min-h-11 w-full items-center border border-dark/12 px-4 text-left text-sm font-semibold text-dark/70'
            >
              Crear publicación
            </Link>
            <Link
              href='/cuenta'
              className='mt-2 flex min-h-11 w-full items-center border border-dark/12 px-4 text-left text-sm font-semibold text-dark/70'
            >
              Configurar cuenta
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

function countByPost(items: { post_id: string }[] | null, postId: string) {
  return items?.filter((item) => item.post_id === postId).length ?? 0;
}

function formatDate(value: string | null) {
  if (!value) return 'Publicado';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-t border-dark/10 pt-3'>
      <p className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>{label}</p>
      <p className='mt-1 text-sm text-dark/75'>{value}</p>
    </div>
  );
}
