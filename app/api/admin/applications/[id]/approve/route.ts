import { NextResponse } from 'next/server';
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

  const { approvalReason } = (await request.json().catch(() => ({}))) as {
    approvalReason?: string;
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

  if (!authUser) {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/auth/update-password`,
      data: {
        nombres: application.nombres,
        apellidos: application.apellidos,
      },
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    authUser = data.user;
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
    message:
      'Postulacion aprobada. La cuenta fue creada para este usuario. Ahora podra entrar a /login con su correo y crear su contrasena.',
  });
}
