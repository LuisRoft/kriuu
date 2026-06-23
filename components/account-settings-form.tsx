'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientSupabaseClient } from '@/lib/supabase/client';

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

export default function AccountSettingsForm() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmation) {
      setMessage('La confirmación debe coincidir con la contraseña.');
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClientSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setPassword('');
      setConfirmation('');
      setMessage('Contraseña actualizada.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar la contraseña.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className='border border-dark/10 bg-white/30 p-5 md:p-7'>
      <h2 className='font-display text-2xl font-semibold'>Seguridad</h2>
      <form onSubmit={updatePassword} className='mt-5 space-y-4'>
        <label className='flex flex-col gap-2'>
          <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
            Nueva contraseña
          </span>
          <input
            className={inputClass}
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label className='flex flex-col gap-2'>
          <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
            Confirmar contraseña
          </span>
          <input
            className={inputClass}
            type='password'
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </label>
        <Button
          type='submit'
          disabled={isSaving}
          className='h-auto gap-2 px-6 py-3.5 text-sm font-semibold'
        >
          <KeyRound className='size-4' />
          {isSaving ? 'Guardando...' : 'Cambiar contraseña'}
        </Button>
      </form>
      {message ? <p className='mt-4 text-sm leading-6 text-dark/70'>{message}</p> : null}
    </section>
  );
}
