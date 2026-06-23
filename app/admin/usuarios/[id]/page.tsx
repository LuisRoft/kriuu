import { notFound } from 'next/navigation';
import Image from 'next/image';
import AdminUserActions from '@/components/admin-user-actions';
import BackButton from '@/components/back-button';
import NoAccess from '@/components/no-access';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { user: currentUser, roles: currentRoles, allowed } = await requireAdminAccess();

  if (!allowed) return <NoAccess />;

  const { id } = await params;
  const supabaseAdmin = createAdminSupabaseClient();
  const [{ data: profile }, { data: roles }, authResult] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select(
        'id,display_name,nombres,apellidos,avatar_url,bio,ciudad,parroquia,carrera,telefono,status,github_url,linkedin_url,twitter_url,instagram_url,website_url,created_at,updated_at',
      )
      .eq('id', id)
      .maybeSingle(),
    supabaseAdmin.from('user_roles').select('role').eq('user_id', id),
    supabaseAdmin.auth.admin.getUserById(id),
  ]);

  const authUser = authResult.data.user;

  if (!profile && !authUser) notFound();

  const { data: applicationByUser } = await supabaseAdmin
    .from('applications')
    .select(
      'id,nombres,apellidos,edad,genero,ciudad,parroquia,correo,telefono,situacion,carrera,intereses,referido,referido_detalle,carta,status,reviewed_at,approval_reason,rejection_reason,created_at',
    )
    .eq('created_user_id', id)
    .maybeSingle();
  const { data: applicationByEmail } =
    !applicationByUser && authUser?.email
      ? await supabaseAdmin
          .from('applications')
          .select(
            'id,nombres,apellidos,edad,genero,ciudad,parroquia,correo,telefono,situacion,carrera,intereses,referido,referido_detalle,carta,status,reviewed_at,approval_reason,rejection_reason,created_at',
          )
          .eq('correo', authUser.email.toLowerCase())
          .maybeSingle()
      : { data: null };
  const application = applicationByUser ?? applicationByEmail;
  const metadata = authUser?.user_metadata ?? {};
  const profileValue = {
    nombres: firstFilled(profile?.nombres, String(metadata.nombres ?? ''), application?.nombres),
    apellidos: firstFilled(profile?.apellidos, String(metadata.apellidos ?? ''), application?.apellidos),
    avatarUrl: firstFilled(profile?.avatar_url),
    bio: firstFilled(profile?.bio),
    ciudad: firstFilled(profile?.ciudad, application?.ciudad),
    parroquia: firstFilled(profile?.parroquia, application?.parroquia),
    carrera: firstFilled(profile?.carrera, application?.carrera),
    telefono: firstFilled(profile?.telefono, application?.telefono),
    githubUrl: firstFilled(profile?.github_url),
    linkedinUrl: firstFilled(profile?.linkedin_url),
    twitterUrl: firstFilled(profile?.twitter_url),
    instagramUrl: firstFilled(profile?.instagram_url),
    websiteUrl: firstFilled(profile?.website_url),
    status: firstFilled(profile?.status, 'active'),
  };
  const displayName =
    profile?.display_name ||
    [profileValue.nombres, profileValue.apellidos].filter(Boolean).join(' ') ||
    authUser?.email ||
    id;

  return (
    <section className='grid gap-6 py-10 lg:grid-cols-[1fr_360px]'>
      <div>
        <div className='mb-8'>
          <BackButton fallbackHref='/admin/usuarios' label='Volver' />
        </div>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Usuario</p>
        <div className='mt-4 flex flex-col gap-5 sm:flex-row sm:items-center'>
          <div className='relative size-24 shrink-0 overflow-hidden border border-dark/10 bg-white/25'>
            {profileValue.avatarUrl ? (
              <Image src={profileValue.avatarUrl} alt='' fill sizes='96px' className='object-cover' />
            ) : (
              <div className='flex size-full items-center justify-center font-display text-4xl text-dark/30'>
                {displayName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className='font-display text-5xl font-semibold leading-none tracking-tight'>
              {displayName}
            </h1>
            <p className='mt-3 text-sm leading-6 text-dark/62'>
              {authUser?.email ?? 'Correo no disponible'}
            </p>
          </div>
        </div>
        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          <DetailGroup title='Cuenta'>
            <Detail label='Correo' value={authUser?.email ?? 'No disponible'} />
            <Detail label='Estado' value={profileValue.status} />
            <Detail label='Roles' value={roles?.map((role) => role.role).join(', ') || 'Sin rol'} />
            <Detail label='ID de usuario' value={id} />
            <Detail label='Email confirmado' value={formatDate(authUser?.email_confirmed_at ?? null)} />
            <Detail label='Cuenta creada' value={formatDate(authUser?.created_at ?? null)} />
            <Detail label='Último ingreso' value={formatDate(authUser?.last_sign_in_at ?? null)} />
          </DetailGroup>
          <DetailGroup title='Perfil'>
            <Detail label='Nombres' value={profileValue.nombres || 'Pendiente'} />
            <Detail label='Apellidos' value={profileValue.apellidos || 'Pendiente'} />
            <Detail label='Bio' value={profileValue.bio || 'Pendiente'} />
            <Detail label='Ciudad' value={profileValue.ciudad || 'Pendiente'} />
            <Detail label='Parroquia' value={profileValue.parroquia || 'Pendiente'} />
            <Detail label='Carrera' value={profileValue.carrera || 'Pendiente'} />
            <Detail label='Teléfono' value={profileValue.telefono || 'Pendiente'} />
            <Detail label='Perfil creado' value={formatDate(profile?.created_at ?? null)} />
            <Detail label='Perfil actualizado' value={formatDate(profile?.updated_at ?? null)} />
          </DetailGroup>
          <DetailGroup title='Redes'>
            <Detail label='GitHub' value={profileValue.githubUrl || 'Pendiente'} />
            <Detail label='LinkedIn' value={profileValue.linkedinUrl || 'Pendiente'} />
            <Detail label='X / Twitter' value={profileValue.twitterUrl || 'Pendiente'} />
            <Detail label='Instagram' value={profileValue.instagramUrl || 'Pendiente'} />
            <Detail label='Sitio web' value={profileValue.websiteUrl || 'Pendiente'} />
          </DetailGroup>
          <DetailGroup title='Postulación'>
            <Detail label='Estado' value={application?.status ?? 'Sin postulación vinculada'} />
            <Detail label='Edad' value={application?.edad ? String(application.edad) : 'Pendiente'} />
            <Detail label='Género' value={application?.genero ?? 'Pendiente'} />
            <Detail label='Situación' value={application?.situacion ?? 'Pendiente'} />
            <Detail label='Intereses' value={application?.intereses?.join(', ') || 'Pendiente'} />
            <Detail label='Referido' value={application?.referido ?? 'Pendiente'} />
            <Detail label='Detalle referido' value={application?.referido_detalle ?? 'Pendiente'} />
            <Detail label='Carta' value={application?.carta ?? 'Pendiente'} />
            <Detail label='Motivo aprobación' value={application?.approval_reason ?? 'Pendiente'} />
            <Detail label='Motivo rechazo' value={application?.rejection_reason ?? 'Pendiente'} />
            <Detail label='Postulación creada' value={formatDate(application?.created_at ?? null)} />
            <Detail label='Revisada' value={formatDate(application?.reviewed_at ?? null)} />
          </DetailGroup>
        </div>
      </div>

      <AdminUserActions
        currentRoles={currentRoles}
        currentStatus={profileValue.status}
        userId={id}
        selectedRoles={roles?.map((role) => String(role.role)) ?? []}
        isCurrentUser={currentUser.id === id}
      />
    </section>
  );
}

function firstFilled(...values: Array<string | null | undefined>) {
  return values.map((value) => String(value ?? '').trim()).find(Boolean) ?? '';
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

function formatDate(value: string | null) {
  if (!value) return 'Nunca';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
