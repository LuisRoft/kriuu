import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles } = await getCurrentSessionUser();

  if (!user || !isAdmin(roles)) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: application, error: findError } = await supabaseAdmin
    .from('applications')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (findError || !application) {
    return NextResponse.json(
      { success: false, error: findError?.message ?? 'Postulación no encontrada.' },
      { status: 404 },
    );
  }

  const { error } = await supabaseAdmin.from('applications').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Postulación eliminada.' });
}
