'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las variables publicas de Supabase.');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
