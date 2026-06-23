'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Power, Save, Trash2 } from 'lucide-react';
import DestructiveConfirmation from '@/components/destructive-confirmation';
import { Button } from '@/components/ui/button';

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

export default function AdminUserActions({
  currentRoles,
  currentStatus,
  isCurrentUser,
  selectedRoles,
  userId,
}: {
  currentRoles: string[];
  currentStatus: string;
  isCurrentUser: boolean;
  selectedRoles: string[];
  userId: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState(selectedRoles);
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(path: string, body: Record<string, string | string[]> = {}) {
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo completar la acción.');
      }

      setMessage(result.message);
      setPassword('');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar la acción.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleRole(role: string) {
    setRoles((current) =>
      current.includes(role) ? current.filter((item) => item !== role) : [...current, role],
    );
  }

  const canAssignCriticalRoles = currentRoles.includes('superadmin');
  const roleOptions = ['member', 'author', 'moderator', 'admin', 'superadmin'];

  return (
    <section className='space-y-6 border border-dark/10 bg-white/30 p-5'>
      <div>
        <h2 className='font-display text-2xl font-semibold'>Administrar acceso</h2>
        <p className='mt-2 text-sm leading-6 text-dark/62'>
          Estas acciones afectan la cuenta real de Supabase Auth y el perfil de Kriuu.
        </p>
      </div>

      <div className='space-y-3 border-t border-dark/10 pt-4'>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>Roles</p>
        <div className='grid gap-2'>
          {roleOptions.map((role) => {
            const isCritical = role === 'admin' || role === 'superadmin';
            const disabled = isCurrentUser || (isCritical && !canAssignCriticalRoles);

            return (
              <button
                key={role}
                type='button'
                disabled={disabled}
                onClick={() => toggleRole(role)}
                className={`min-h-10 border px-3 text-left text-sm font-semibold transition-colors disabled:opacity-45 ${
                  roles.includes(role)
                    ? 'border-olive bg-olive/10 text-olive'
                    : 'border-dark/10 text-dark/65 hover:border-dark/25 hover:text-dark'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
        <Button
          type='button'
          disabled={isSubmitting || isCurrentUser}
          onClick={() => submit('roles', { roles })}
          className='h-auto gap-2 px-5 py-3 text-sm'
        >
          <Save className='size-4' />
          Guardar roles
        </Button>
        {isCurrentUser ? (
          <p className='text-xs leading-5 text-dark/55'>
            No puedes cambiar tus propios roles desde este panel.
          </p>
        ) : null}
      </div>

      <div className='space-y-3 border-t border-dark/10 pt-4'>
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
        <Button
          type='button'
          disabled={isSubmitting || password.length < 8}
          onClick={() => submit('password', { password })}
          className='h-auto gap-2 px-5 py-3 text-sm'
        >
          <KeyRound className='size-4' />
          Cambiar contraseña
        </Button>
      </div>

      <div className='space-y-3 border-t border-dark/10 pt-4'>
        <label className='flex flex-col gap-2'>
          <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
            Estado de acceso
          </span>
          <select
            className={inputClass}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value='active'>active</option>
            <option value='inactive'>inactive</option>
            <option value='suspended'>suspended</option>
          </select>
        </label>
        <Button
          type='button'
          disabled={isSubmitting || isCurrentUser}
          onClick={() => submit('status', { status })}
          variant='outline'
          className='h-auto gap-2 border-dark/12 bg-transparent px-5 py-3 text-sm'
        >
          <Power className='size-4' />
          Actualizar estado
        </Button>
        {isCurrentUser ? (
          <p className='text-xs leading-5 text-dark/55'>
            No puedes desactivar tu propia cuenta desde este panel.
          </p>
        ) : null}
      </div>

      <div className='space-y-3 border-t border-dark/10 pt-4'>
        <DestructiveConfirmation
          disabled={isSubmitting || isCurrentUser}
          title='Borrar cuenta'
          description='Esta acción elimina la cuenta de Supabase Auth, su perfil y sus roles. No se puede deshacer desde el panel.'
          confirmLabel='Borrar cuenta'
          onConfirm={() => submit('delete')}
        >
          <span className='inline-flex min-h-11 items-center gap-2 bg-red-800 px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 aria-disabled:opacity-50'>
            <Trash2 className='size-4' />
            Borrar cuenta
          </span>
        </DestructiveConfirmation>
      </div>

      {message ? <p className='text-sm leading-6 text-dark/70'>{message}</p> : null}
    </section>
  );
}
