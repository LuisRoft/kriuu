import { NextResponse } from 'next/server';
import { isMember } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';
import { createPostSlug } from '@/lib/posts';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

const MAX_COVER_SIZE = 5 * 1024 * 1024;
const ALLOWED_COVER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: Request) {
  const { user, roles, isActive } = await getCurrentSessionUser();

  if (!user || !isActive || !isMember(roles)) {
    return NextResponse.json({ success: false, error: 'No tienes permisos.' }, { status: 403 });
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
  let coverImageUrl = '';

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

  const { error } = await supabaseAdmin.from('posts').insert({
    author_id: user.id,
    title,
    slug: createPostSlug(title),
    excerpt,
    content,
    cover_image_url: coverImageUrl || null,
    status: 'in_review',
    visibility,
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

function getCoverExtension(file: File) {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}
