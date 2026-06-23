import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, isActive } = await getCurrentSessionUser();

  if (!user || !isActive) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  const { content } = (await request.json().catch(() => ({}))) as { content?: string };
  const trimmedContent = content?.trim() ?? '';

  if (!trimmedContent) {
    return NextResponse.json(
      { success: false, error: 'El comentario no puede quedar vacío.' },
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
  const { data: comment } = await supabaseAdmin
    .from('comments')
    .select('id,user_id,status')
    .eq('id', id)
    .maybeSingle();

  if (!comment || comment.status !== 'published') {
    return NextResponse.json(
      { success: false, error: 'Comentario no encontrado.' },
      { status: 404 },
    );
  }

  if (comment.user_id !== user.id) {
    return NextResponse.json(
      { success: false, error: 'Solo puedes editar tus propios comentarios.' },
      { status: 403 },
    );
  }

  const { error } = await supabaseAdmin
    .from('comments')
    .update({
      content: trimmedContent,
      edited_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Comentario actualizado.' });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles, isActive } = await getCurrentSessionUser();

  if (!user || !isActive) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: comment } = await supabaseAdmin
    .from('comments')
    .select('id,user_id,status')
    .eq('id', id)
    .maybeSingle();

  if (!comment || comment.status !== 'published') {
    return NextResponse.json(
      { success: false, error: 'Comentario no encontrado.' },
      { status: 404 },
    );
  }

  if (comment.user_id !== user.id && !isAdmin(roles)) {
    return NextResponse.json(
      { success: false, error: 'No puedes borrar este comentario.' },
      { status: 403 },
    );
  }

  const { error } = await supabaseAdmin
    .from('comments')
    .update({
      status: 'deleted',
      edited_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Comentario borrado.' });
}
