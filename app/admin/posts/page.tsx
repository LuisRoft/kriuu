import Link from 'next/link';
import NoAccess from '@/components/no-access';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export default async function AdminPostsPage() {
  const { allowed } = await requireAdminAccess();

  if (!allowed) return <NoAccess />;

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select(
      'id,title,excerpt,status,created_at,submitted_at,published_at,approved_at,approved_by,updated_at,edited_at,author_id',
    )
    .order('updated_at', { ascending: false });
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id,display_name,nombres,apellidos');

  return (
    <section className='py-10'>
      <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Posts</p>
      <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
        Revisión editorial.
      </h1>
      <p className='mt-5 max-w-2xl text-base leading-7 text-dark/68'>
        Revisa las publicaciones enviadas por miembros antes de publicarlas para la comunidad.
      </p>
      <div className='mt-8 overflow-x-auto border border-dark/10 bg-white/25'>
        <table className='w-full min-w-[1160px] border-collapse text-left text-sm'>
          <thead className='border-b border-dark/10 text-xs uppercase tracking-[0.16em] text-dark/45'>
            <tr>
              <th className='px-4 py-3'>Título</th>
              <th className='px-4 py-3'>Autor</th>
              <th className='px-4 py-3'>Estado</th>
              <th className='px-4 py-3'>Enviado</th>
              <th className='px-4 py-3'>Publicado</th>
              <th className='px-4 py-3'>Aprobado</th>
              <th className='px-4 py-3'>Aprobado por</th>
              <th className='px-4 py-3'>Último cambio</th>
              <th className='px-4 py-3'>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => (
              <tr key={post.id} className='border-b border-dark/10 last:border-0'>
                <td className='px-4 py-3 font-semibold'>{post.title}</td>
                <td className='px-4 py-3 text-dark/70'>
                  <ProfileLink profiles={profiles} id={post.author_id} fallback='Sin autor' />
                </td>
                <td className='px-4 py-3 text-dark/70'>{post.status}</td>
                <td className='px-4 py-3 text-dark/70'>{formatDate(post.submitted_at)}</td>
                <td className='px-4 py-3 text-dark/70'>{formatDate(post.published_at)}</td>
                <td className='px-4 py-3 text-dark/70'>{formatDate(post.approved_at)}</td>
                <td className='px-4 py-3 text-dark/70'>
                  {post.approved_by ? (
                    <ProfileLink profiles={profiles} id={post.approved_by} fallback='Sin nombre' />
                  ) : (
                    'Pendiente'
                  )}
                </td>
                <td className='px-4 py-3 text-dark/70'>
                  {formatDate(post.edited_at ?? post.updated_at ?? post.approved_at ?? post.created_at)}
                </td>
                <td className='px-4 py-3'>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className='font-semibold text-dark/70 transition-colors hover:text-olive'
                  >
                    Revisar
                  </Link>
                </td>
              </tr>
            ))}
            {!posts?.length ? (
              <tr>
                <td className='px-4 py-8 text-center text-dark/60' colSpan={9}>
                  No hay publicaciones todavía.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProfileLink({
  fallback,
  id,
  profiles,
}: {
  fallback: string;
  id: string;
  profiles:
    | {
        id: string;
        display_name: string | null;
        nombres: string | null;
        apellidos: string | null;
      }[]
    | null;
}) {
  return (
    <Link href={`/miembros/${id}`} className='font-semibold transition-colors hover:text-olive'>
      {getProfileName(profiles, id, fallback)}
    </Link>
  );
}

function getProfileName(
  profiles:
    | {
        id: string;
        display_name: string | null;
        nombres: string | null;
        apellidos: string | null;
      }[]
    | null,
  id: string,
  fallback = 'Kriuu',
) {
  const profile = profiles?.find((item) => item.id === id);
  return (
    profile?.display_name ||
    [profile?.nombres, profile?.apellidos].filter(Boolean).join(' ') ||
    fallback
  );
}

function formatDate(value: string | null) {
  if (!value) return 'Pendiente';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}
