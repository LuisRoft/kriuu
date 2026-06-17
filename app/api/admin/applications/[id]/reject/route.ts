import { NextResponse } from 'next/server';
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

  const { rejectionReason } = (await request.json().catch(() => ({}))) as {
    rejectionReason?: string;
  };

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: application, error: applicationError } = await supabaseAdmin
    .from('applications')
    .select('id,status')
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

  const { error } = await supabaseAdmin
    .from('applications')
    .update({
      status: 'rejected',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason?.trim() ?? '',
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Postulacion rechazada.' });
}
