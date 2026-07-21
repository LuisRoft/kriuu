import { NextResponse } from 'next/server';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };

  if (!password || password.length < 8) {
    return NextResponse.json(
      { success: false, error: 'La contraseña debe tener al menos 8 caracteres.' },
      { status: 400 },
    );
  }

  const { user } = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'No hay una sesión activa.' }, { status: 401 });
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password,
    app_metadata: {
      ...user.app_metadata,
      must_change_password: false,
    },
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
