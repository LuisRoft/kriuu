import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createPostSlug } from '@/lib/posts';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const MAX_COVER_SIZE = 5 * 1024 * 1024;
const ALLOWED_COVER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, roles } = await getCurrentSessionUser();

  if (!user || !isSuperAdmin(roles)) {
    return NextResponse.json(
      { success: false, error: 'Solo un superadmin puede editar publicaciones.' },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const title = String(formData.get('title') ?? '').trim();
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const visibilityInput = String(formData.get('visibility') ?? 'members_only');
  const visibility = visibilityInput === 'public' ? 'public' : 'members_only';
  const cover = formData.get('cover');

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { success: false, error: 'Completa título, descripción y contenido.' },
      { status: 400 },
    );
  }

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('id,title,cover_image_url')
    .eq('id', id)
    .maybeSingle();

  if (!post) {
    return NextResponse.json(
      { success: false, error: 'Publicación no encontrada.' },
      { status: 404 },
    );
  }

  let coverImageUrl = post.cover_image_url;

  if (cover instanceof File && cover.size > 0) {
    if (cover.size > MAX_COVER_SIZE) {
      return NextResponse.json(
        { success: false, error: 'La portada debe pesar máximo 5MB.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_COVER_TYPES.has(cover.type)) {
      return NextResponse.json(
        { success: false, error: 'La portada debe ser JPG, PNG o WEBP.' },
        { status: 400 },
      );
    }

    const extension = getCoverExtension(cover);
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('post-covers')
      .upload(path, cover, {
        contentType: cover.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from('post-covers').getPublicUrl(path);
    coverImageUrl = data.publicUrl;
  }

  const titleChanged = title !== post.title;
  const { error } = await supabaseAdmin
    .from('posts')
    .update({
      title,
      slug: titleChanged ? createPostSlug(title) : undefined,
      excerpt,
      content,
      visibility,
      cover_image_url: coverImageUrl || null,
      edited_by: user.id,
      edited_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from('post_reviews').insert({
    post_id: id,
    reviewer_id: user.id,
    action: 'edited_by_superadmin',
    notes: 'Publicación editada por superadmin.',
  });

  return NextResponse.json({ success: true, message: 'Publicación actualizada.' });
}

function getCoverExtension(file: File) {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}
