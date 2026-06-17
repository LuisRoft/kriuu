import Link from 'next/link';
import AccountProfileForm from '@/components/account-profile-form';
import AccountSettingsForm from '@/components/account-settings-form';
import BackButton from '@/components/back-button';
import NoAccess from '@/components/no-access';
import SignOutButton from '@/components/sign-out-button';
import { requirePlatformAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export default async function AccountPage() {
  const { user, roles, allowed } = await requirePlatformAccess();

  if (!allowed) return <NoAccess />;

  const supabaseAdmin = createAdminSupabaseClient();
  const [{ data: profile }, { data: application }] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select(
        'display_name,nombres,apellidos,avatar_url,bio,status,ciudad,parroquia,carrera,telefono,github_url,linkedin_url,twitter_url,instagram_url,website_url',
      )
      .eq('id', user.id)
      .maybeSingle(),
    user.email
      ? supabaseAdmin
          .from('applications')
          .select('nombres,apellidos,ciudad,parroquia,carrera,telefono')
          .eq('correo', user.email.toLowerCase())
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const metadata = user.user_metadata ?? {};
  const fallbackNombres = String(metadata.nombres ?? application?.nombres ?? '');
  const fallbackApellidos = String(metadata.apellidos ?? application?.apellidos ?? '');
  const profileValue = {
    nombres: firstFilled(profile?.nombres, fallbackNombres),
    apellidos: firstFilled(profile?.apellidos, fallbackApellidos),
    avatarUrl: firstFilled(profile?.avatar_url),
    bio: firstFilled(profile?.bio),
    email: user.email ?? '',
    ciudad: firstFilled(profile?.ciudad, application?.ciudad),
    parroquia: firstFilled(profile?.parroquia, application?.parroquia),
    carrera: firstFilled(profile?.carrera, application?.carrera),
    telefono: firstFilled(profile?.telefono, application?.telefono),
    githubUrl: firstFilled(profile?.github_url),
    linkedinUrl: firstFilled(profile?.linkedin_url),
    twitterUrl: firstFilled(profile?.twitter_url),
    instagramUrl: firstFilled(profile?.instagram_url),
    websiteUrl: firstFilled(profile?.website_url),
  };

  const displayName =
    profile?.display_name ||
    [profileValue.nombres, profileValue.apellidos].filter(Boolean).join(' ') ||
    user.email;

  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <div className='mx-auto max-w-5xl'>
        <header className='flex flex-col gap-4 border-b border-dark/10 pb-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='mb-6'>
              <BackButton fallbackHref='/dashboard' label='Volver' />
            </div>
            <div>
              <Link href='/dashboard' className='font-display text-2xl font-semibold tracking-tight'>
                kriuu.
              </Link>
              <p className='mt-1 text-sm text-dark/60'>Configuración de cuenta</p>
            </div>
          </div>
          <SignOutButton className='h-auto w-fit gap-2 px-5 py-3 text-sm' />
        </header>

        <section className='grid gap-6 py-10 lg:grid-cols-[1fr_360px]'>
          <div>
            <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Cuenta</p>
            <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
              {displayName}
            </h1>
            <p className='mt-5 max-w-2xl text-base leading-7 text-dark/68'>
              Desde aquí puedes cambiar tu contraseña y mantener actualizada la información base de tu perfil.
            </p>
            <div className='mt-8 space-y-5'>
              <AccountProfileForm
                initialValue={profileValue}
              />
              <AccountSettingsForm />
            </div>
          </div>

          <aside className='space-y-4 border border-dark/10 bg-white/30 p-5'>
            <h2 className='font-display text-2xl font-semibold'>Perfil</h2>
            <Info label='Correo' value={user.email ?? 'No disponible'} />
            <Info label='Estado' value={String(profile?.status ?? 'active')} />
            <Info label='Roles' value={roles.join(', ') || 'Sin rol'} />
            <Info label='Bio' value={profileValue.bio || 'Pendiente'} />
            <Info label='Ciudad' value={profileValue.ciudad || 'Pendiente'} />
            <Info label='Parroquia' value={profileValue.parroquia || 'Pendiente'} />
            <Info label='Carrera' value={profileValue.carrera || 'Pendiente'} />
            <Info label='Teléfono' value={profileValue.telefono || 'Pendiente'} />
            <Info label='GitHub' value={profileValue.githubUrl || 'Pendiente'} />
            <Info label='LinkedIn' value={profileValue.linkedinUrl || 'Pendiente'} />
            <Info label='X / Twitter' value={profileValue.twitterUrl || 'Pendiente'} />
            <Info label='Instagram' value={profileValue.instagramUrl || 'Pendiente'} />
            <Info label='Sitio web' value={profileValue.websiteUrl || 'Pendiente'} />
          </aside>
        </section>
      </div>
    </main>
  );
}

function firstFilled(...values: Array<string | null | undefined>) {
  return values.map((value) => String(value ?? '').trim()).find(Boolean) ?? '';
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-t border-dark/10 pt-3'>
      <p className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>{label}</p>
      <p className='mt-1 text-sm text-dark/75'>{value}</p>
    </div>
  );
}
