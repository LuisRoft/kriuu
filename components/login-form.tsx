'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientSupabaseClient } from '@/lib/supabase/client';

type AccessState =
  | { status: 'idle' }
  | { status: 'missing' | 'pending' | 'rejected' | 'needs_password' | 'ready' | 'no_role'; message: string };

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

export default function LoginForm() {
  const [mode, setMode] = useState<'login' | 'first_access'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState<AccessState>({ status: 'idle' });
  const [isChecking, setIsChecking] = useState(false);
  const [isSendingPasswordEmail, setIsSendingPasswordEmail] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [message, setMessage] = useState('');

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  function switchMode(nextMode: 'login' | 'first_access') {
    setMode(nextMode);
    setAccess({ status: 'idle' });
    setMessage('');
    setPassword('');
  }

  async function checkAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setPassword('');

    if (!normalizedEmail) {
      setAccess({ status: 'missing', message: 'Ingresa tu correo para continuar.' });
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch('/api/auth/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const result = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(result.error || 'No se pudo revisar el acceso.');
      }

      setAccess({ status: result.status, message: result.message });
    } catch (error) {
      setAccess({
        status: 'missing',
        message: error instanceof Error ? error.message : 'No se pudo revisar el acceso.',
      });
    } finally {
      setIsChecking(false);
    }
  }

  async function requestPasswordEmail() {
    setMessage('');
    setIsSendingPasswordEmail(true);

    try {
      const response = await fetch('/api/auth/request-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const result = await readJsonResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo enviar el correo.');
      }

      setMessage('Te enviamos un enlace para crear o recuperar tu contraseña. Revisa también spam o promociones.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo enviar el correo.');
    } finally {
      setIsSendingPasswordEmail(false);
    }
  }

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!password) {
      setMessage('Ingresa tu contraseña.');
      return;
    }

    setIsSigningIn(true);

    try {
      const supabase = createClientSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      const response = await fetch('/api/auth/after-login', { method: 'POST' });
      const result = await readJsonResponse(response);

      window.location.href = result.redirectTo ?? '/dashboard';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <section className='border border-dark/10 bg-white/30 p-5 md:p-7'>
      {mode === 'login' ? (
        <>
          <form onSubmit={signIn} className='space-y-4'>
            <label className='flex flex-col gap-2'>
              <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
                Correo
              </span>
              <input
                className={inputClass}
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='tu@correo.com'
              />
            </label>
            <label className='flex flex-col gap-2'>
              <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
                Contraseña
              </span>
              <input
                className={inputClass}
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <Button
              type='submit'
              disabled={isSigningIn}
              className='h-auto w-full gap-2 px-6 py-3.5 text-sm font-semibold'
            >
              {isSigningIn ? 'Entrando...' : 'Iniciar sesión'}
              <ArrowRight className='size-4' />
            </Button>
          </form>

          <div className='mt-5 border-t border-dark/10 pt-5'>
            <button
              type='button'
              onClick={() => switchMode('first_access')}
              className='text-left text-sm font-semibold text-dark/62 underline-offset-4 transition-colors hover:text-dark hover:underline'
            >
              Si es tu primera vez iniciando sesión o olvidaste tu contraseña, entra desde aquí.
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            type='button'
            onClick={() => switchMode('login')}
            className='mb-5 inline-flex min-h-10 items-center gap-2 border border-dark/12 px-3 text-sm font-semibold text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
          >
            <ArrowLeft className='size-4' />
            Volver a iniciar sesión
          </button>

          <form onSubmit={checkAccess} className='space-y-4'>
            <label className='flex flex-col gap-2'>
              <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
                Correo
              </span>
              <input
                className={inputClass}
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='tu@correo.com'
              />
            </label>
            <Button
              type='submit'
              disabled={isChecking}
              className='h-auto w-full gap-2 px-6 py-3.5 text-sm font-semibold'
            >
              <Mail className='size-4' />
              {isChecking ? 'Revisando...' : 'Revisar acceso'}
            </Button>
          </form>
        </>
      )}

      {mode === 'first_access' && access.status !== 'idle' ? (
        <div className='mt-5 border-t border-dark/10 pt-5'>
          <p className='text-sm leading-6 text-dark/70'>{access.message}</p>

          {access.status === 'missing' ? (
            <Button asChild className='mt-4 h-auto px-5 py-3 text-sm'>
              <Link href='/#join'>Postular a Kriuu</Link>
            </Button>
          ) : null}

          {access.status === 'needs_password' ? (
            <div className='mt-4 space-y-3'>
              <Button
                type='button'
                onClick={requestPasswordEmail}
                disabled={isSendingPasswordEmail}
                className='h-auto gap-2 px-5 py-3 text-sm'
              >
                <KeyRound className='size-4' />
                {isSendingPasswordEmail ? 'Enviando...' : 'Crear contraseña'}
              </Button>
              <p className='text-xs leading-5 text-dark/55'>
                Si Supabase limita el correo temporalmente, un admin o superadmin puede asignarte una contraseña temporal desde Usuarios.
              </p>
            </div>
          ) : null}

          {access.status === 'ready' ? (
            <Button
              type='button'
              onClick={requestPasswordEmail}
              disabled={isSendingPasswordEmail}
              className='mt-4 h-auto gap-2 px-5 py-3 text-sm'
            >
              <KeyRound className='size-4' />
              {isSendingPasswordEmail ? 'Enviando enlace...' : 'Enviar enlace para cambiar contraseña'}
            </Button>
          ) : null}
        </div>
      ) : null}

      {message ? (
        <p className='mt-4 border border-dark/10 bg-cream px-4 py-3 text-sm leading-6 text-dark/70'>
          {message}
        </p>
      ) : null}
    </section>
  );
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: response.ok
        ? 'La respuesta del servidor no fue válida.'
        : 'El servidor respondió con un error inesperado.',
    };
  }
}
