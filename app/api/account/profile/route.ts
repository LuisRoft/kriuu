import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type ProfilePayload = {
  nombres?: string;
  apellidos?: string;
  avatarUrl?: string;
  bio?: string;
  email?: string;
  ciudad?: string;
  parroquia?: string;
  carrera?: string;
  telefono?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Debes iniciar sesión.' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as ProfilePayload;
  const nombres = payload.nombres?.trim() ?? '';
  const apellidos = payload.apellidos?.trim() ?? '';
  const email = payload.email?.trim().toLowerCase() ?? '';

  if (!nombres || !apellidos) {
    return NextResponse.json(
      { success: false, error: 'Ingresa nombres y apellidos.' },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: 'Ingresa un correo válido.' },
      { status: 400 },
    );
  }

  const socialUrls = {
    github_url: normalizeUrl(payload.githubUrl),
    linkedin_url: normalizeUrl(payload.linkedinUrl),
    twitter_url: normalizeUrl(payload.twitterUrl),
    instagram_url: normalizeUrl(payload.instagramUrl),
    website_url: normalizeUrl(payload.websiteUrl),
  };
  const invalidUrl = Object.values(socialUrls).find((value) => value === null);

  if (invalidUrl === null) {
    return NextResponse.json(
      { success: false, error: 'Revisa tus redes. Deben ser enlaces válidos.' },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabaseClient();

  if (email !== user.email?.toLowerCase()) {
    const { error: emailError } = await supabase.auth.updateUser({ email });

    if (emailError) {
      return NextResponse.json({ success: false, error: emailError.message }, { status: 500 });
    }
  }

  const supabaseAdmin = createAdminSupabaseClient();
  await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      nombres,
      apellidos,
      display_name: [nombres, apellidos].filter(Boolean).join(' '),
    },
  });

  const baseProfileData = {
    id: user.id,
    nombres,
    apellidos,
    display_name: [nombres, apellidos].filter(Boolean).join(' '),
    ciudad: payload.ciudad?.trim() ?? '',
    parroquia: payload.parroquia?.trim() ?? '',
    carrera: payload.carrera?.trim() ?? '',
    telefono: payload.telefono?.trim() ?? '',
  };
  const { error } = await supabaseAdmin.from('profiles').upsert(
    {
      ...baseProfileData,
      avatar_url: payload.avatarUrl?.trim() ?? '',
      bio: payload.bio?.trim() ?? '',
      github_url: socialUrls.github_url,
      linkedin_url: socialUrls.linkedin_url,
      twitter_url: socialUrls.twitter_url,
      instagram_url: socialUrls.instagram_url,
      website_url: socialUrls.website_url,
    },
    { onConflict: 'id' },
  );

  if (error) {
    if (isMissingProfileColumnError(error.message)) {
      const { error: fallbackError } = await supabaseAdmin
        .from('profiles')
        .upsert(baseProfileData, { onConflict: 'id' });

      if (fallbackError) {
        return NextResponse.json({ success: false, error: fallbackError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message:
          'Perfil base actualizado. Para guardar bio, foto y redes falta ejecutar la migración de columnas nuevas en Supabase.',
      });
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message:
      email !== user.email?.toLowerCase()
        ? 'Perfil actualizado. Revisa tu correo para confirmar el cambio de email.'
        : 'Perfil actualizado.',
  });
}

function isMissingProfileColumnError(message: string) {
  const lowerMessage = message.toLowerCase();

  return (
    lowerMessage.includes('could not find') &&
    lowerMessage.includes('column') &&
    lowerMessage.includes('profiles')
  );
}

function normalizeUrl(value?: string) {
  const trimmed = value?.trim() ?? '';

  if (!trimmed) return '';

  const urlWithProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(urlWithProtocol);

    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}
