import { redirect } from 'next/navigation';
import { ADMIN_ROLES, PLATFORM_ROLES, getUserRoles, hasRole } from '@/lib/auth/roles';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentSessionUser() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, roles: [], profile: null, isActive: false };
  }

  const roles = await getUserRoles(user.id);
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .maybeSingle();
  const isActive = !profile?.status || profile.status === 'active';

  return { user, roles, profile, isActive };
}

export async function requireAuth(redirectTo = '/login') {
  const { user, roles, profile, isActive } = await getCurrentSessionUser();

  if (!user) {
    redirect(redirectTo);
  }

  return { user, roles, profile, isActive };
}

export async function requireRoles(allowedRoles: readonly string[], redirectTo = '/login') {
  const { user, roles, profile, isActive } = await requireAuth(redirectTo);

  if (!isActive || !hasRole(roles, allowedRoles)) {
    return { user, roles, profile, isActive, allowed: false };
  }

  return { user, roles, profile, isActive, allowed: true };
}

export async function requirePlatformAccess() {
  return requireRoles(PLATFORM_ROLES);
}

export async function requireAdminAccess() {
  return requireRoles(ADMIN_ROLES);
}
