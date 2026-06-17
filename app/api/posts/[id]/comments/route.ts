import { NextResponse } from 'next/server';
import { isMember } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles, isActive } = await getCurrentSessionUser();

  if (!user || !isActive || !isMember(roles)) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  const { content } = (await request.json().catch(() => ({}))) as { content?: string };
  const trimmedContent = content?.trim() ?? '';

  if (!trimmedContent) {
    return NextResponse.json(
      { success: false, error: 'Escribe un comentario antes de enviarlo.' },
      { status: 400 },
    );
  }

  if (trimmedContent.length > 2000) {
    return NextResponse.json(
      { success: false, error: 'El comentario no puede superar 2000 caracteres.' },
      { status: 400 },
    );
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

  const { error } = await supabaseAdmin.from('comments').insert({
    post_id: id,
    user_id: user.id,
    content: trimmedContent,
    status: 'published',
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
