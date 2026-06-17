'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientSupabaseClient } from '@/lib/supabase/client';

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [isPreparingSession, setIsPreparingSession] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function prepareSession() {
      const supabase = createClientSupabaseClient();
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setMessage(error.message);
        } else {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage(
          'El enlace no abrió una sesión válida. Vuelve a /login y solicita un nuevo enlace para crear o recuperar tu contraseña.',
        );
      }

      setIsPreparingSession(false);
    }

    prepareSession();
  }, []);

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

      router.push('/dashboard');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la contraseña.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className='border border-dark/10 bg-white/30 p-5 md:p-7'>
      <form onSubmit={updatePassword} className='space-y-4'>
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
          disabled={isSaving || isPreparingSession}
          className='h-auto w-full gap-2 px-6 py-3.5 text-sm font-semibold'
        >
          <KeyRound className='size-4' />
          {isPreparingSession ? 'Preparando acceso...' : isSaving ? 'Guardando...' : 'Guardar contraseña'}
        </Button>
      </form>
      {message ? (
        <p className='mt-4 border border-red-900/15 bg-red-900/8 px-4 py-3 text-sm font-medium text-red-800'>
          {message}
        </p>
      ) : null}
    </section>
  );
}
