import Link from 'next/link';
import AdminCreateUserActions from '@/components/admin-create-user-actions';
import NoAccess from '@/components/no-access';
import { isSuperAdmin } from '@/lib/auth/roles';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export default async function AdminUsersPage() {
  const { roles: currentRoles, allowed } = await requireAdminAccess();

  if (!allowed) return <NoAccess />;

  const supabaseAdmin = createAdminSupabaseClient();
  const [{ data: profiles }, { data: roles }, { data: users }] = await Promise.all([
    supabaseAdmin.from('profiles').select('id,display_name,nombres,apellidos,ciudad,carrera,status').order('display_name'),
    supabaseAdmin.from('user_roles').select('user_id,role'),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  return (
    <section className='py-10'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Usuarios</p>
          <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
            Miembros activos.
          </h1>
        </div>
        {isSuperAdmin(currentRoles) ? <AdminCreateUserActions /> : null}
      </div>

      <div className='mt-8 overflow-x-auto border border-dark/10 bg-white/25'>
        <table className='w-full min-w-[820px] border-collapse text-left text-sm'>
          <thead className='border-b border-dark/10 text-xs uppercase tracking-[0.16em] text-dark/45'>
            <tr>
              <th className='px-4 py-3'>Nombre</th>
              <th className='px-4 py-3'>Correo</th>
              <th className='px-4 py-3'>Ciudad</th>
              <th className='px-4 py-3'>Carrera</th>
              <th className='px-4 py-3'>Estado</th>
              <th className='px-4 py-3'>Roles</th>
              <th className='px-4 py-3'>Acción</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile) => (
              <tr key={profile.id} className='border-b border-dark/10 last:border-0'>
                <td className='px-4 py-3 font-semibold'>{profile.display_name || `${profile.nombres ?? ''} ${profile.apellidos ?? ''}`}</td>
                <td className='px-4 py-3 text-dark/70'>{users?.users.find((user) => user.id === profile.id)?.email ?? 'No disponible'}</td>
                <td className='px-4 py-3 text-dark/70'>{profile.ciudad ?? ''}</td>
                <td className='px-4 py-3 text-dark/70'>{profile.carrera ?? ''}</td>
                <td className='px-4 py-3 text-dark/70'>{profile.status ?? 'active'}</td>
                <td className='px-4 py-3 text-dark/70'>
                  {roles?.filter((role) => role.user_id === profile.id).map((role) => role.role).join(', ') || 'Sin rol'}
                </td>
                <td className='px-4 py-3'>
                  <Link
                    href={`/admin/usuarios/${profile.id}`}
                    className='font-semibold text-dark/70 transition-colors hover:text-olive'
                  >
                    Administrar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
