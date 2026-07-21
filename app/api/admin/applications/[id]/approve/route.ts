import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getSiteUrl, findAuthUserByEmail } from '@/lib/auth/admin';
import { isAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user: adminUser, roles } = await getCurrentSessionUser();

  if (!adminUser || !isAdmin(roles)) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  const { approvalReason, approveWithoutEmail } = (await request.json().catch(() => ({}))) as {
    approvalReason?: string;
    approveWithoutEmail?: boolean;
  };

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: application, error: applicationError } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (applicationError || !application) {
    return NextResponse.json(
      { success: false, error: applicationError?.message ?? 'Postulacion no encontrada.' },
      { status: 404 },
    );
  }

  if (application.status !== 'pending') {
    return NextResponse.json(
      { success: false, error: 'Esta postulacion ya fue revisada.' },
      { status: 400 },
    );
  }

  const email = String(application.correo ?? '').trim().toLowerCase();
  if (!email) {
    return NextResponse.json(
      { success: false, error: 'La postulacion no tiene correo.' },
      { status: 400 },
    );
  }

  let authUser = await findAuthUserByEmail(email);
  const accountAlreadyExisted = Boolean(authUser);
  let approvalEmailSent: boolean | null = null;
  let temporaryPassword: string | null = null;

  if (!authUser) {
    if (approveWithoutEmail) {
      temporaryPassword = createTemporaryPassword();
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        password: temporaryPassword,
        app_metadata: {
          must_change_password: true,
        },
        user_metadata: {
          nombres: application.nombres,
          apellidos: application.apellidos,
          approval_email_sent: false,
          approval_email_issue: 'rate_limit',
        },
      });

      if (error || !data.user) {
        return NextResponse.json(
          { success: false, error: error?.message ?? 'No se pudo crear la cuenta sin correo.' },
          { status: 500 },
        );
      }

      authUser = data.user;
      approvalEmailSent = false;
    } else {
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${getSiteUrl(request)}/auth/callback?next=/auth/update-password`,
        data: {
          nombres: application.nombres,
          apellidos: application.apellidos,
          approval_email_sent: true,
        },
      });

      if (error) {
        if (isEmailRateLimitError(error)) {
          return NextResponse.json(
            {
              success: false,
              code: 'email_rate_limit',
              canApproveWithoutEmail: true,
              error:
                'Supabase alcanzó el límite de correos. La invitación no se envió, pero puedes aprobar la postulación y crear la cuenta sin correo.',
            },
            { status: 429 },
          );
        }

        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      if (!data.user) {
        return NextResponse.json(
          { success: false, error: 'Supabase no devolvió el usuario invitado.' },
          { status: 500 },
        );
      }

      authUser = data.user;
      approvalEmailSent = true;
    }
  }

  const displayName = [application.nombres, application.apellidos].filter(Boolean).join(' ');

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
    {
      id: authUser.id,
      nombres: application.nombres,
      apellidos: application.apellidos,
      display_name: displayName,
      ciudad: application.ciudad,
      parroquia: application.parroquia,
      carrera: application.carrera,
      telefono: application.telefono,
      status: 'active',
    },
    { onConflict: 'id' },
  );

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  const { error: roleError } = await supabaseAdmin.from('user_roles').upsert(
    {
      user_id: authUser.id,
      role: 'member',
      assigned_by: adminUser.id,
    },
    { onConflict: 'user_id,role' },
  );

  if (roleError) {
    return NextResponse.json({ success: false, error: roleError.message }, { status: 500 });
  }

  const { error: updateError } = await supabaseAdmin
    .from('applications')
    .update({
      status: 'approved',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      approval_reason: approvalReason?.trim() ?? '',
      created_user_id: authUser.id,
    })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    emailSent: approvalEmailSent,
    temporaryPassword,
    message: accountAlreadyExisted
      ? 'Postulación aprobada. La cuenta ya existía, por lo que no fue necesario enviar una invitación.'
      : approvalEmailSent === false
        ? 'Postulación aprobada y cuenta creada sin enviar correo. Entrega la contraseña temporal al usuario; deberá cambiarla en su primer ingreso.'
        : 'Postulación aprobada. La cuenta fue creada y la invitación fue enviada por correo.',
  });
}

function createTemporaryPassword() {
  return `Kriuu-${randomBytes(12).toString('base64url')}!9a`;
}

function isEmailRateLimitError(error: { code?: string; message: string; status?: number }) {
  const value = `${error.code ?? ''} ${error.message}`.toLowerCase();

  return (
    error.status === 429 ||
    value.includes('rate limit') ||
    value.includes('over_email_send_rate_limit') ||
    value.includes('email rate limit exceeded')
  );
}
