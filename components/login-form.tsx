'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientSupabaseClient } from '@/lib/supabase/client';

type AccessStatus =
  | 'missing'
  | 'pending'
  | 'rejected'
  | 'needs_password'
  | 'temporary_password'
  | 'ready'
  | 'no_role';

type AccessState =
  | { status: 'idle' }
  | { status: AccessStatus; message: string };

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [access, setAccess] = useState<AccessState>({ status: 'idle' });
  const [isChecking, setIsChecking] = useState(false);
  const [isSendingPasswordEmail, setIsSendingPasswordEmail] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [message, setMessage] = useState('');

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const hasCheckedEmail = access.status !== 'idle';

  function resetEmailStep() {
    setAccess({ status: 'idle' });
    setMessage('');
    setPassword('');
    setNewPassword('');
    setConfirmation('');
  }

  async function checkAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!normalizedEmail) {
      setMessage('Ingresa tu correo para continuar.');
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
      setMessage(error instanceof Error ? error.message : 'No se pudo revisar el acceso.');
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

      setMessage(
        'Te enviamos un enlace para crear o recuperar tu contraseña. Revisa también spam o promociones.',
      );
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

  async function completeFirstAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!password) {
      setMessage('Ingresa la contraseña temporal que te entregó el administrador.');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('Tu nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmation) {
      setMessage('La confirmación debe coincidir con la nueva contraseña.');
      return;
    }

    setIsSigningIn(true);

    try {
      const supabase = createClientSupabaseClient();
      const { error: temporarySignInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (temporarySignInError) {
        throw new Error('La contraseña temporal no es válida.');
      }

      const completionResponse = await fetch('/api/auth/complete-first-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const completionResult = await readJsonResponse(completionResponse);

      if (!completionResponse.ok || !completionResult.success) {
        throw new Error(completionResult.error || 'No se pudo guardar tu nueva contraseña.');
      }

      const { error: finalSignInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: newPassword,
      });

      if (finalSignInError) throw finalSignInError;

      const redirectResponse = await fetch('/api/auth/after-login', { method: 'POST' });
      const redirectResult = await readJsonResponse(redirectResponse);

      window.location.href = redirectResult.redirectTo ?? '/dashboard';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar el primer acceso.');
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <section className='border border-dark/10 bg-white/30 p-5 md:p-7'>
      {!hasCheckedEmail ? (
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
              autoComplete='email'
            />
          </label>
          <Button
            type='submit'
            disabled={isChecking}
            className='h-auto w-full gap-2 px-6 py-3.5 text-sm font-semibold'
          >
            <Mail className='size-4' />
            {isChecking ? 'Revisando...' : 'Continuar'}
          </Button>
        </form>
      ) : (
        <>
          <button
            type='button'
            onClick={resetEmailStep}
            className='mb-5 inline-flex min-h-10 items-center gap-2 border border-dark/12 px-3 text-sm font-semibold text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
          >
            <ArrowLeft className='size-4' />
            Cambiar correo
          </button>

          <p className='mb-4 text-sm leading-6 text-dark/70'>{access.message}</p>

          {access.status === 'ready' ? (
            <form onSubmit={signIn} className='space-y-4'>
              <PasswordField
                label='Contraseña'
                value={password}
                onChange={setPassword}
                autoComplete='current-password'
              />
              <Button
                type='submit'
                disabled={isSigningIn}
                className='h-auto w-full gap-2 px-6 py-3.5 text-sm font-semibold'
              >
                {isSigningIn ? 'Entrando...' : 'Iniciar sesión'}
                <ArrowRight className='size-4' />
              </Button>
              <button
                type='button'
                onClick={requestPasswordEmail}
                disabled={isSendingPasswordEmail}
                className='text-left text-sm font-semibold text-dark/62 underline-offset-4 transition-colors hover:text-dark hover:underline disabled:opacity-50'
              >
                {isSendingPasswordEmail ? 'Enviando enlace...' : 'Olvidé mi contraseña'}
              </button>
            </form>
          ) : null}

          {access.status === 'temporary_password' ? (
            <form onSubmit={completeFirstAccess} className='space-y-4'>
              <PasswordField
                label='Contraseña temporal'
                value={password}
                onChange={setPassword}
                autoComplete='current-password'
              />
              <PasswordField
                label='Crea tu contraseña'
                value={newPassword}
                onChange={setNewPassword}
                autoComplete='new-password'
              />
              <PasswordField
                label='Confirma tu contraseña'
                value={confirmation}
                onChange={setConfirmation}
                autoComplete='new-password'
              />
              <Button
                type='submit'
                disabled={isSigningIn}
                className='h-auto w-full gap-2 px-6 py-3.5 text-sm font-semibold'
              >
                <KeyRound className='size-4' />
                {isSigningIn ? 'Guardando...' : 'Crear contraseña e ingresar'}
              </Button>
              <button
                type='button'
                onClick={requestPasswordEmail}
                disabled={isSendingPasswordEmail}
                className='text-left text-sm font-semibold text-dark/62 underline-offset-4 transition-colors hover:text-dark hover:underline disabled:opacity-50'
              >
                {isSendingPasswordEmail
                  ? 'Enviando enlace...'
                  : 'También puedo crearla mediante un correo'}
              </button>
            </form>
          ) : null}

          {access.status === 'needs_password' ? (
            <div className='space-y-3'>
              <Button
                type='button'
                onClick={requestPasswordEmail}
                disabled={isSendingPasswordEmail}
                className='h-auto gap-2 px-5 py-3 text-sm'
              >
                <KeyRound className='size-4' />
                {isSendingPasswordEmail ? 'Enviando...' : 'Crear contraseña por correo'}
              </Button>
              <p className='text-xs leading-5 text-dark/55'>
                Si el correo está limitado temporalmente, un administrador puede asignarte una contraseña temporal. Luego vuelve aquí, escribe tu correo y podrás crear tu contraseña definitiva.
              </p>
            </div>
          ) : null}

          {access.status === 'missing' ? (
            <Button asChild className='h-auto px-5 py-3 text-sm'>
              <Link href='/#join'>Postular a Kriuu</Link>
            </Button>
          ) : null}
        </>
      )}

      {message ? (
        <p className='mt-4 border border-dark/10 bg-cream px-4 py-3 text-sm leading-6 text-dark/70'>
          {message}
        </p>
      ) : null}
    </section>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
}) {
  return (
    <label className='flex flex-col gap-2'>
      <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
        {label}
      </span>
      <input
        className={inputClass}
        type='password'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
      />
    </label>
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
