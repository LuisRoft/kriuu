import { NextResponse } from 'next/server';
import { findAuthUserByEmail, getSiteUrl } from '@/lib/auth/admin';
import { PLATFORM_ROLES } from '@/lib/auth/roles';
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
          'Falta configurar SUPABASE_SERVICE_ROLE_KEY. Es necesaria para enviar correos de creación de contraseña.',
      },
      { status: 500 },
    );
  }
  let authUser;

  try {
    authUser = await findAuthUserByEmail(normalizedEmail);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo validar la cuenta en Supabase Auth.',
      },
      { status: 500 },
    );
  }

  const { data: roles, error: rolesError } = authUser
    ? await supabaseAdmin.from('user_roles').select('role').eq('user_id', authUser.id)
    : { data: null, error: null };

  if (rolesError) {
    return NextResponse.json({ success: false, error: rolesError.message }, { status: 500 });
  }

  const hasPlatformRole =
    roles?.some((item) => PLATFORM_ROLES.includes(String(item.role) as never)) ?? false;
  const { data: application, error: applicationError } = await supabaseAdmin
    .from('applications')
    .select('status,nombres,apellidos')
    .eq('correo', normalizedEmail)
    .maybeSingle();

  if (applicationError) {
    return NextResponse.json(
      { success: false, error: applicationError.message },
      { status: 500 },
    );
  }

  if (application?.status !== 'approved' && !hasPlatformRole) {
    return NextResponse.json(
      { success: false, error: 'Tu cuenta todavía no está aprobada.' },
      { status: 403 },
    );
  }

  const redirectTo = `${getSiteUrl()}/auth/callback?next=/auth/update-password`;

  if (!authUser && application?.status === 'approved') {
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo,
      data: {
        nombres: application.nombres,
        apellidos: application.apellidos,
      },
    });

    if (error) {
      const passwordEmailError = getPasswordEmailError(error.message);

      return NextResponse.json(
        { success: false, error: passwordEmailError.message },
        { status: passwordEmailError.status },
      );
    }

    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo,
  });

  if (error) {
    const passwordEmailError = getPasswordEmailError(error.message);

    return NextResponse.json(
      { success: false, error: passwordEmailError.message },
      { status: passwordEmailError.status },
    );
  }

  return NextResponse.json({ success: true });
}

function getPasswordEmailError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('redirect') || lowerMessage.includes('not allowed')) {
    return {
      status: 500,
      message:
        'Supabase no permite la URL de redirección. Agrega http://localhost:3000/auth/callback en Authentication > URL Configuration.',
    };
  }

  if (
    lowerMessage.includes('rate') ||
    lowerMessage.includes('security purposes') ||
    lowerMessage.includes('only request')
  ) {
    return {
      status: 429,
      message:
        'Supabase limitó el envío de correos por ahora. Intenta de nuevo en unos minutos. Si necesitas entrar ahora, pide a un admin o superadmin que te configure una contraseña temporal desde Usuarios.',
    };
  }

  return { status: 500, message };
}
