import Link from 'next/link';
import NoAccess from '@/components/no-access';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const { allowed } = await requireAdminAccess();

  if (!allowed) return <NoAccess />;

  const params = await searchParams;
  const status = ['pending', 'approved', 'rejected'].includes(params.status ?? '')
    ? params.status
    : 'pending';
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: applications } = await supabaseAdmin
    .from('applications')
    .select('id,nombres,apellidos,correo,ciudad,carrera,intereses,status,created_at')
    .eq('status', status)
    .order('created_at', { ascending: false });

  return (
    <section className='py-10'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Postulaciones</p>
          <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
            Solicitudes.
          </h1>
        </div>
        <div className='flex flex-wrap gap-2'>
          {['pending', 'approved', 'rejected'].map((item) => (
            <Link
              key={item}
              href={`/admin/postulaciones?status=${item}`}
              className={`min-h-10 border px-4 py-2 text-sm font-semibold ${
                status === item
                  ? 'border-olive bg-olive text-white'
                  : 'border-dark/12 text-dark/65 hover:border-dark/25'
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      <div className='mt-8 overflow-x-auto border border-dark/10 bg-white/25'>
        <table className='w-full min-w-[860px] border-collapse text-left text-sm'>
          <thead className='border-b border-dark/10 text-xs uppercase tracking-[0.16em] text-dark/45'>
            <tr>
              <th className='px-4 py-3'>Nombre</th>
              <th className='px-4 py-3'>Correo</th>
              <th className='px-4 py-3'>Ciudad</th>
              <th className='px-4 py-3'>Carrera</th>
              <th className='px-4 py-3'>Intereses</th>
              <th className='px-4 py-3'>Fecha</th>
              <th className='px-4 py-3'>Estado</th>
              <th className='px-4 py-3'>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((application) => (
              <tr key={application.id} className='border-b border-dark/10 last:border-0'>
                <td className='px-4 py-3 font-semibold'>
                  <Link href={`/admin/postulaciones/${application.id}`} className='hover:text-olive'>
                    {application.nombres} {application.apellidos}
                  </Link>
                </td>
                <td className='px-4 py-3 text-dark/70'>{application.correo}</td>
                <td className='px-4 py-3 text-dark/70'>{application.ciudad}</td>
                <td className='px-4 py-3 text-dark/70'>{application.carrera}</td>
                <td className='px-4 py-3 text-dark/70'>{formatInterests(application.intereses)}</td>
                <td className='px-4 py-3 text-dark/70'>{formatDate(application.created_at)}</td>
                <td className='px-4 py-3 text-dark/70'>{application.status}</td>
                <td className='px-4 py-3'>
                  <Link
                    href={`/admin/postulaciones/${application.id}`}
                    className='font-semibold text-dark/70 transition-colors hover:text-olive'
                  >
                    Revisar
                  </Link>
                </td>
              </tr>
            ))}
            {!applications?.length ? (
              <tr>
                <td className='px-4 py-8 text-center text-dark/60' colSpan={8}>
                  No hay postulaciones en este estado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatInterests(value: unknown) {
  return Array.isArray(value) ? value.join(', ') : '';
}

function formatDate(value: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}
