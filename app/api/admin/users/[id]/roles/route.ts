import { NextResponse } from 'next/server';
import { PLATFORM_ROLES, isAdmin, isSuperAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const CRITICAL_ROLES = ['admin', 'superadmin'];

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles: currentRoles } = await getCurrentSessionUser();

  if (!user || !isAdmin(currentRoles)) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  if (user.id === id) {
    return NextResponse.json(
      { success: false, error: 'No puedes cambiar tus propios roles desde este panel.' },
      { status: 400 },
    );
  }

  const { roles } = (await request.json().catch(() => ({}))) as { roles?: string[] };
  const nextRoles = Array.from(new Set(roles ?? [])).filter((role) =>
    PLATFORM_ROLES.includes(role as never),
  );

  if (!nextRoles.length) {
    return NextResponse.json(
      { success: false, error: 'Selecciona al menos un rol.' },
      { status: 400 },
    );
  }

  if (nextRoles.some((role) => CRITICAL_ROLES.includes(role)) && !isSuperAdmin(currentRoles)) {
    return NextResponse.json(
      { success: false, error: 'Solo un superadmin puede asignar roles admin o superadmin.' },
      { status: 403 },
    );
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { error: deleteError } = await supabaseAdmin.from('user_roles').delete().eq('user_id', id);

  if (deleteError) {
    return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
  }

  const { error: insertError } = await supabaseAdmin.from('user_roles').insert(
    nextRoles.map((role) => ({
      user_id: id,
      role,
      assigned_by: user.id,
    })),
  );

  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Roles actualizados.' });
}
