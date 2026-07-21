import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles } = await getCurrentSessionUser();

  if (!user || !isAdmin(roles)) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  const { password } = (await request.json().catch(() => ({}))) as { password?: string };

  if (!password || password.length < 8) {
    return NextResponse.json(
      { success: false, error: 'La contraseña debe tener al menos 8 caracteres.' },
      { status: 400 },
    );
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: targetUserResult, error: targetUserError } =
    await supabaseAdmin.auth.admin.getUserById(id);

  if (targetUserError || !targetUserResult.user) {
    return NextResponse.json(
      { success: false, error: targetUserError?.message ?? 'Usuario no encontrado.' },
      { status: 404 },
    );
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    password,
    app_metadata: {
      ...targetUserResult.user.app_metadata,
      must_change_password: true,
    },
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Contraseña temporal actualizada. El usuario deberá cambiarla al ingresar.',
  });
}
