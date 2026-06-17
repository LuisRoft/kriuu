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

  if (user.id === id) {
    return NextResponse.json(
      { success: false, error: 'No puedes cambiar el estado de tu propia cuenta.' },
      { status: 400 },
    );
  }

  const { status } = (await request.json().catch(() => ({}))) as { status?: string };

  if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
    return NextResponse.json({ success: false, error: 'Estado inválido.' }, { status: 400 });
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ status })
    .eq('id', id);

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
    ban_duration: status === 'active' ? 'none' : '876000h',
  });

  if (authError) {
    return NextResponse.json({ success: false, error: authError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: status === 'active' ? 'Cuenta reactivada.' : 'Cuenta desactivada.',
  });
}
