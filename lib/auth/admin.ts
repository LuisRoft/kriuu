import type { User } from '@supabase/supabase-js';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { normalizeSiteUrl, productionSiteUrl } from '@/lib/site';

export async function findAuthUserByEmail(email: string): Promise<User | null> {
  const supabaseAdmin = createAdminSupabaseClient();
  const normalizedEmail = email.trim().toLowerCase();
  let page = 1;

  while (page <= 20) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw error;

    const user = data.users.find((item) => item.email?.toLowerCase() === normalizedEmail);
    if (user) return user;
    if (data.users.length < 1000) return null;

    page += 1;
  }

  return null;
}

export function getSiteUrl(request?: Request) {
  const configuredSiteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const isLocalConfiguredUrl = configuredSiteUrl
    ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredSiteUrl)
    : false;

  if (process.env.NODE_ENV === 'production') {
    return configuredSiteUrl && !isLocalConfiguredUrl
      ? configuredSiteUrl
      : productionSiteUrl;
  }

  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  const vercelSiteUrl = normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);

  if (vercelSiteUrl) {
    return vercelSiteUrl;
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return 'http://localhost:3000';
}
