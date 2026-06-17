import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles } = await getCurrentSessionUser();

  if (!user || !isSuperAdmin(roles)) {
    return NextResponse.json(
      { success: false, error: 'Solo un superadmin puede borrar publicaciones.' },
      { status: 403 },
    );
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Publicación borrada.' });
}
