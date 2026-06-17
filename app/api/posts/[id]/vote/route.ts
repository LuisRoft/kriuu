import { NextResponse } from 'next/server';
import { isMember } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles, isActive } = await getCurrentSessionUser();

  if (!user || !isActive || !isMember(roles)) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('id,status')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();

  if (!post) {
    return NextResponse.json(
      { success: false, error: 'La publicación no está disponible.' },
      { status: 404 },
    );
  }

  const { data: existingVote } = await supabaseAdmin
    .from('post_votes')
    .select('post_id')
    .eq('post_id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingVote) {
    const { error } = await supabaseAdmin
      .from('post_votes')
      .delete()
      .eq('post_id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, voted: false });
  }

  const { error } = await supabaseAdmin.from('post_votes').insert({
    post_id: id,
    user_id: user.id,
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, voted: true });
}
