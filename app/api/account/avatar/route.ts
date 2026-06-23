import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Debes iniciar sesión.' }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('avatar');

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'Selecciona una imagen.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: 'La foto debe ser JPG, PNG o WEBP.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return NextResponse.json(
      { success: false, error: 'La foto no debe superar 2 MB.' },
      { status: 400 },
    );
  }

  const extension = getExtension(file);
  const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;
  const supabaseAdmin = createAdminSupabaseClient();
  const { error } = await supabaseAdmin.storage
    .from('profile-avatars')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from('profile-avatars').getPublicUrl(filePath);

  return NextResponse.json({ success: true, avatarUrl: data.publicUrl });
}

function getExtension(file: File) {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}
