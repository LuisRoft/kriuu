'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function SignOutButton({ className = '' }: { className?: string }) {
  async function signOut() {
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <Button type='button' onClick={signOut} className={className}>
      <LogOut className='size-4' />
      Cerrar sesión
    </Button>
  );
}
