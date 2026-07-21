import { NextResponse } from 'next/server';
import { isAdmin, isMember } from '@/lib/auth/roles';
import { getCurrentSessionUser } from '@/lib/auth/session';

export async function POST() {
  const { user, roles, isActive } = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json({ redirectTo: '/login' });
  }

  if (user.app_metadata?.must_change_password === true) {
    return NextResponse.json({ redirectTo: '/auth/update-password?first=1' });
  }

  if (!isActive) {
    return NextResponse.json({ redirectTo: '/login?error=inactive' });
  }

  if (isAdmin(roles)) {
    return NextResponse.json({ redirectTo: '/admin' });
  }

  if (isMember(roles)) {
    return NextResponse.json({ redirectTo: '/dashboard' });
  }

  return NextResponse.json({ redirectTo: '/login?error=no-role' });
}
