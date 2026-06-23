import { notFound } from 'next/navigation';
import AdminApplicationActions from '@/components/admin-application-actions';
import BackButton from '@/components/back-button';
import NoAccess from '@/components/no-access';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { allowed } = await requireAdminAccess();

  if (!allowed) return <NoAccess />;

  const { id } = await params;
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: application } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!application) notFound();

  let reviewerEmail = '';

  if (application.reviewed_by) {
    try {
      const reviewerResult = await supabaseAdmin.auth.admin.getUserById(application.reviewed_by);
      reviewerEmail = reviewerResult.data.user?.email ?? '';
    } catch {
      reviewerEmail = '';
    }
  }
  const { data: reviewerProfile } = application.reviewed_by
    ? await supabaseAdmin
        .from('profiles')
        .select('display_name,nombres,apellidos')
        .eq('id', application.reviewed_by)
        .maybeSingle()
    : { data: null };
  const reviewerName =
    reviewerProfile?.display_name ||
    [reviewerProfile?.nombres, reviewerProfile?.apellidos].filter(Boolean).join(' ') ||
    reviewerEmail ||
    'Pendiente';

  return (
    <section className='grid gap-6 py-10 lg:grid-cols-[1fr_360px]'>
      <div>
        <div className='mb-8'>
          <BackButton fallbackHref='/admin/postulaciones' label='Volver' />
        </div>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Postulación</p>
        <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
          {application.nombres} {application.apellidos}
        </h1>
        <p className='mt-4 text-sm leading-6 text-dark/65'>
          Estado actual: <span className='font-semibold text-dark'>{application.status}</span>
        </p>

        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          <DetailGroup title='Datos personales'>
            <Detail label='Correo' value={application.correo} />
            <Detail label='Teléfono' value={application.telefono} />
            <Detail label='Edad' value={String(application.edad)} />
            <Detail label='Género' value={application.genero} />
            <Detail label='Ciudad' value={application.ciudad} />
            <Detail label='Parroquia / sector' value={application.parroquia} />
          </DetailGroup>
          <DetailGroup title='Formación'>
            <Detail label='Situación' value={application.situacion} />
            <Detail label='Carrera' value={application.carrera} />
            <Detail label='Intereses' value={formatInterests(application.intereses)} />
            <Detail label='Cómo nos conoció' value={application.referido} />
            <Detail label='Detalle' value={application.referido_detalle || 'Sin detalle'} />
          </DetailGroup>
          <DetailGroup title='Carta'>
            <Detail
              label='Por qué quiere unirse'
              value={application.carta || 'No escribió carta.'}
            />
          </DetailGroup>
          <DetailGroup title='Acuerdos'>
            <Detail label='Código de conducta' value={application.acepta_codigo_conducta ? 'Aceptado' : 'No'} />
            <Detail label='Uso de datos' value={application.acepta_uso_datos ? 'Aceptado' : 'No'} />
            <Detail label='Fecha de envío' value={formatDate(application.created_at)} />
            <Detail label='Revisado' value={formatDate(application.reviewed_at)} />
          </DetailGroup>
          <DetailGroup title='Resultado'>
            <Detail label='Usuario creado' value={application.created_user_id || 'Pendiente'} />
            <Detail label='Revisado por' value={reviewerName} />
            <Detail label='Motivo de aprobación' value={application.approval_reason || 'Sin motivo'} />
            <Detail label='Motivo de rechazo' value={application.rejection_reason || 'Sin motivo'} />
          </DetailGroup>
        </div>
      </div>

      <AdminApplicationActions applicationId={application.id} disabled={application.status !== 'pending'} />
    </section>
  );
}

function DetailGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className='space-y-3 border border-dark/10 bg-white/25 p-5'>
      <h2 className='font-display text-2xl font-semibold'>{title}</h2>
      {children}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-t border-dark/10 pt-3'>
      <p className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>{label}</p>
      <p className='mt-1 text-sm leading-6 text-dark/75'>{value}</p>
    </div>
  );
}

function formatInterests(value: unknown) {
  return Array.isArray(value) ? value.join(', ') : '';
}

function formatDate(value: string | null) {
  if (!value) return 'Pendiente';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
