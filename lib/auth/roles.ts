import { createServerSupabaseClient } from '@/lib/supabase/server';

export const PLATFORM_ROLES = ['member', 'author', 'moderator', 'admin', 'superadmin'] as const;
export const ADMIN_ROLES = ['admin', 'superadmin'] as const;

export type UserRole = (typeof PLATFORM_ROLES)[number];

export function hasRole(roles: string[], allowedRoles: readonly string[]) {
  return roles.some((role) => allowedRoles.includes(role));
}

export function isMember(roles: string[]) {
  return hasRole(roles, ['member', 'author', 'moderator', 'admin', 'superadmin']);
}

export function isAuthor(roles: string[]) {
  return hasRole(roles, ['author', 'admin', 'superadmin']);
}

export function isAdmin(roles: string[]) {
  return hasRole(roles, ADMIN_ROLES);
}

export function isSuperAdmin(roles: string[]) {
  return hasRole(roles, ['superadmin']);
}

export async function getUserRoles(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error || !data) return [];

  return data.map((item) => String(item.role));
}
