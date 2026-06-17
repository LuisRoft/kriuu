import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/auth/admin';
import { PLATFORM_ROLES, isSuperAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type CreateUserPayload = {
  nombres?: string;
  apellidos?: string;
  email?: string;
  ciudad?: string;
  carrera?: string;
  telefono?: string;
  roles?: string[];
};

export async function POST(request: Request) {
  const { user, roles: currentRoles } = await getCurrentSessionUser();

  if (!user || !isSuperAdmin(currentRoles)) {
    return NextResponse.json(
      { success: false, error: 'Solo un superadmin puede crear usuarios.' },
      { status: 403 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as CreateUserPayload;
  const nombres = payload.nombres?.trim() ?? '';
  const apellidos = payload.apellidos?.trim() ?? '';
  const email = payload.email?.trim().toLowerCase() ?? '';
  const roles = Array.from(new Set(payload.roles ?? [])).filter((role) =>
    PLATFORM_ROLES.includes(role as never),
  );

  if (!nombres || !apellidos) {
    return NextResponse.json(
      { success: false, error: 'Ingresa nombres y apellidos.' },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: 'Ingresa un correo válido.' },
      { status: 400 },
    );
  }

  if (!roles.length) {
    return NextResponse.json(
      { success: false, error: 'Selecciona al menos un rol.' },
      { status: 400 },
    );
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/auth/update-password`,
    data: { nombres, apellidos },
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const createdUser = data.user;

  if (!createdUser) {
    return NextResponse.json(
      { success: false, error: 'No se pudo crear el usuario.' },
      { status: 500 },
    );
  }

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
    {
      id: createdUser.id,
      nombres,
      apellidos,
      display_name: [nombres, apellidos].join(' '),
      ciudad: payload.ciudad?.trim() ?? '',
      carrera: payload.carrera?.trim() ?? '',
      telefono: payload.telefono?.trim() ?? '',
      status: 'active',
    },
    { onConflict: 'id' },
  );

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  const { error: roleError } = await supabaseAdmin.from('user_roles').insert(
    roles.map((role) => ({
      user_id: createdUser.id,
      role,
      assigned_by: user.id,
    })),
  );

  if (roleError) {
    return NextResponse.json({ success: false, error: roleError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Usuario creado e invitado por correo.',
    userId: createdUser.id,
  });
}
