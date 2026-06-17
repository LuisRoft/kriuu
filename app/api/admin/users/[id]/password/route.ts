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
  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Contraseña actualizada.' });
}
