import Link from 'next/link';
import NoAccess from '@/components/no-access';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export default async function AdminPage() {
  const { allowed } = await requireAdminAccess();

  if (!allowed) return <NoAccess />;

  const supabaseAdmin = createAdminSupabaseClient();
  const [
    { count: pendingApplications },
    { count: approvedApplications },
    { count: profiles },
    { count: pendingPosts },
    { data: applications },
    { data: userProfiles },
    { data: userRoles },
    { data: authUsers },
    { data: posts },
    { data: publishedPosts },
  ] = await Promise.all([
    supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved'),
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'in_review'),
    supabaseAdmin
      .from('applications')
      .select('id,nombres,apellidos,correo,ciudad,carrera,status,created_at')
      .order('created_at', { ascending: false })
      .limit(6),
    supabaseAdmin
      .from('profiles')
      .select('id,display_name,nombres,apellidos,ciudad,carrera,status')
      .order('display_name')
      .limit(6),
    supabaseAdmin.from('user_roles').select('user_id,role'),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabaseAdmin.from('posts').select('id,title,status,created_at').order('created_at', { ascending: false }).limit(6),
    supabaseAdmin
      .from('posts')
      .select('id,title,status,published_at,visibility')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6),
  ]);

  return (
    <section className='space-y-10 py-10'>
      <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Admin</p>
      <div>
        <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight md:text-7xl'>
          Revisión y comunidad.
        </h1>
        <p className='mt-5 max-w-2xl text-base leading-7 text-dark/68'>
          Resumen operativo de Kriuu: postulaciones, miembros y revisión editorial en un mismo lugar.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <Metric href='/admin/postulaciones?status=pending' label='Postulaciones pendientes' value={pendingApplications ?? 0} />
        <Metric href='/admin/postulaciones?status=approved' label='Postulaciones aprobadas' value={approvedApplications ?? 0} />
        <Metric href='/admin/usuarios' label='Usuarios registrados' value={profiles ?? 0} />
        <Metric href='/admin/posts' label='Posts en revisión' value={pendingPosts ?? 0} />
      </div>

      <DashboardTable
        href='/admin/postulaciones'
        title='Postulaciones recientes'
        headers={['Nombre', 'Correo', 'Ciudad', 'Carrera', 'Estado', 'Fecha']}
        emptyMessage='Todavía no hay postulaciones.'
        rows={
          applications?.map((application) => ({
            href: `/admin/postulaciones/${application.id}`,
            cells: [
              `${application.nombres ?? ''} ${application.apellidos ?? ''}`.trim(),
              application.correo ?? '',
              application.ciudad ?? '',
              application.carrera ?? '',
              application.status ?? '',
              formatDate(application.created_at),
            ],
          })) ?? []
        }
      />

      <DashboardTable
        href='/admin/usuarios'
        title='Usuarios'
        headers={['Nombre', 'Correo', 'Ciudad', 'Carrera', 'Estado', 'Roles']}
        emptyMessage='Todavía no hay usuarios.'
        rows={
          userProfiles?.map((profile) => ({
            href: `/admin/usuarios/${profile.id}`,
            cells: [
              profile.display_name || `${profile.nombres ?? ''} ${profile.apellidos ?? ''}`.trim(),
              authUsers?.users.find((user) => user.id === profile.id)?.email ?? 'No disponible',
              profile.ciudad ?? '',
              profile.carrera ?? '',
              profile.status ?? 'active',
              userRoles
                ?.filter((role) => role.user_id === profile.id)
                .map((role) => role.role)
                .join(', ') || 'Sin rol',
            ],
          })) ?? []
        }
      />

      <DashboardTable
        href='/admin/posts'
        title='Posts'
        headers={['Título', 'Estado', 'Fecha']}
        emptyMessage='La revisión de posts queda lista como espacio para la siguiente fase.'
        rows={
          posts?.map((post) => ({
            href: `/admin/posts/${post.id}`,
            cells: [post.title ?? `Post ${post.id}`, post.status ?? '', formatDate(post.created_at)],
          })) ?? []
        }
      />

      <DashboardTable
        href='/posts'
        title='Publicaciones disponibles'
        headers={['Título', 'Visibilidad', 'Publicado']}
        emptyMessage='Todavía no hay publicaciones disponibles para lectura.'
        rows={
          publishedPosts?.map((post) => ({
            href: `/admin/posts/${post.id}`,
            cells: [
              post.title ?? `Post ${post.id}`,
              post.visibility ?? '',
              formatDate(post.published_at),
            ],
          })) ?? []
        }
      />
    </section>
  );
}

function Metric({ href, label, value }: { href: string; label: string; value: number }) {
  return (
    <Link href={href} className='border border-dark/10 bg-white/30 p-5 transition-colors hover:border-dark/25'>
      <p className='text-sm font-medium text-dark/60'>{label}</p>
      <p className='mt-4 font-display text-5xl font-semibold'>{value}</p>
    </Link>
  );
}

function DashboardTable({
  emptyMessage,
  headers,
  href,
  rows,
  title,
}: {
  emptyMessage: string;
  headers: string[];
  href: string;
  rows: { cells: string[]; href: string }[];
  title: string;
}) {
  return (
    <section>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h2 className='font-display text-3xl font-semibold'>{title}</h2>
        <Link href={href} className='text-sm font-semibold text-dark/62 transition-colors hover:text-dark'>
          Ver todo
        </Link>
      </div>
      <div className='overflow-x-auto border border-dark/10 bg-white/25'>
        <table className='w-full min-w-[760px] border-collapse text-left text-sm'>
          <thead className='border-b border-dark/10 text-xs uppercase tracking-[0.16em] text-dark/45'>
            <tr>
              {headers.map((header) => (
                <th key={header} className='px-4 py-3'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.href}-${index}`} className='border-b border-dark/10 last:border-0'>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className={`px-4 py-3 ${cellIndex === 0 ? 'font-semibold' : 'text-dark/70'}`}
                  >
                    {cellIndex === 0 ? (
                      <Link href={row.href} className='transition-colors hover:text-olive'>
                        {cell || 'Sin nombre'}
                      </Link>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className='px-4 py-8 text-center text-dark/60' colSpan={headers.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}
