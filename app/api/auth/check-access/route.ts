import { NextResponse } from 'next/server';
import { PLATFORM_ROLES } from '@/lib/auth/roles';
import { findAuthUserByEmail } from '@/lib/auth/admin';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return NextResponse.json({ success: false, error: 'Ingresa tu correo.' }, { status: 400 });
  }

  let supabaseAdmin;

  try {
    supabaseAdmin = createAdminSupabaseClient();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          'Falta configurar SUPABASE_SERVICE_ROLE_KEY. Es necesaria para validar cuentas aprobadas y roles.',
      },
      { status: 500 },
    );
  }
  const { data: application, error } = await supabaseAdmin
    .from('applications')
    .select('id,status')
    .eq('correo', normalizedEmail)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const authUser = await findAuthUserByEmail(normalizedEmail);
  const { data: roles } = authUser
    ? await supabaseAdmin.from('user_roles').select('role').eq('user_id', authUser.id)
    : { data: null };
  const { data: profile } = authUser
    ? await supabaseAdmin.from('profiles').select('status').eq('id', authUser.id).maybeSingle()
    : { data: null };
  const userRoles = roles?.map((item) => String(item.role)) ?? [];
  const hasPlatformRole = userRoles.some((role) => PLATFORM_ROLES.includes(role as never));
  const isActive = !profile?.status || profile.status === 'active';

  if (authUser && hasPlatformRole && !isActive) {
    return NextResponse.json({
      status: 'rejected',
      message: 'Tu cuenta está desactivada. Contacta al equipo de Kriuu si crees que es un error.',
    });
  }

  if (authUser && hasPlatformRole && !application) {
    if (!authUser.last_sign_in_at) {
      return NextResponse.json({
        status: 'needs_password',
        message: 'Tu cuenta está aprobada. Crea tu contraseña para entrar por primera vez.',
      });
    }

    return NextResponse.json({
      status: 'ready',
      message: 'Tu cuenta está lista. Ingresa tu contraseña para entrar.',
    });
  }

  if (!application) {
    return NextResponse.json({
      status: 'missing',
      message: 'Primero debes postular para formar parte de Kriuu.',
    });
  }

  if (application.status === 'pending') {
    return NextResponse.json({
      status: 'pending',
      message: 'Tu solicitud todavía está en revisión. Te avisaremos cuando sea aprobada.',
    });
  }

  if (application.status === 'rejected') {
    return NextResponse.json({
      status: 'rejected',
      message: 'Tu solicitud no fue aprobada por el momento.',
    });
  }

  if (!authUser) {
    return NextResponse.json({
      status: 'needs_password',
      message: 'Tu cuenta fue aprobada. Crea tu contraseña para entrar a la plataforma.',
    });
  }

  if (!hasPlatformRole) {
    return NextResponse.json({
      status: 'no_role',
      message: 'Tu cuenta existe, pero todavía no tiene permisos asignados.',
    });
  }

  if (!authUser.last_sign_in_at) {
    return NextResponse.json({
      status: 'needs_password',
      message: 'Tu cuenta está aprobada. Crea tu contraseña para entrar por primera vez.',
    });
  }

  return NextResponse.json({
    status: 'ready',
    message: 'Tu cuenta está lista. Ingresa tu contraseña para entrar.',
  });
}
