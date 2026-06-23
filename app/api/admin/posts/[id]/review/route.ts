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

  const { reviewNotes } = (await request.json().catch(() => ({}))) as {
    reviewNotes?: string;
  };
  const notes = reviewNotes?.trim() || 'Se retiró de publicaciones disponibles para nueva revisión.';
  const supabaseAdmin = createAdminSupabaseClient();

  const { error } = await supabaseAdmin
    .from('posts')
    .update({
      status: 'in_review',
      published_at: null,
      review_notes: notes,
      edited_by: user.id,
      edited_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'published');

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from('post_reviews').insert({
    post_id: id,
    reviewer_id: user.id,
    action: 'sent_to_review',
    notes,
  });

  return NextResponse.json({
    success: true,
    message: 'Publicación retirada y enviada de nuevo a revisión.',
  });
}
