'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, Trash2, X } from 'lucide-react';
import DestructiveConfirmation from '@/components/destructive-confirmation';
import { Button } from '@/components/ui/button';

export default function AdminApplicationActions({
  applicationId,
  disabled,
}: {
  applicationId: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [approvalReason, setApprovalReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState('');
  const [canApproveWithoutEmail, setCanApproveWithoutEmail] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitAction(action: 'approve' | 'reject', approveWithoutEmail = false) {
    setMessage('');
    if (!approveWithoutEmail) {
      setCanApproveWithoutEmail(false);
      setTemporaryPassword('');
      setPasswordCopied(false);
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalReason, rejectionReason, approveWithoutEmail }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        if (action === 'approve' && result.canApproveWithoutEmail) {
          setCanApproveWithoutEmail(true);
          setMessage(result.error);
          return;
        }

        throw new Error(result.error || 'No se pudo completar la acción.');
      }

      setCanApproveWithoutEmail(false);
      setTemporaryPassword(result.temporaryPassword ?? '');
      setMessage(result.message);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar la acción.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteApplication() {
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/delete`, {
        method: 'POST',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo eliminar la postulación.');
      }

      const currentPath = `${window.location.pathname}${window.location.search}`;
      const previousPath = sessionStorage.getItem('kriuu:previous-path');
      let destination = '/admin/postulaciones';

      if (
        previousPath &&
        previousPath.startsWith('/') &&
        !previousPath.startsWith('//') &&
        previousPath !== currentPath &&
        !previousPath.startsWith(`/admin/postulaciones/${applicationId}`)
      ) {
        destination = previousPath;
      }

      router.replace(destination);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar la postulación.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className='space-y-4 border border-dark/10 bg-white/30 p-5'>
      <h2 className='font-display text-2xl font-semibold'>Revisión</h2>
      <label className='flex flex-col gap-2'>
        <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
          Motivo de aprobación
        </span>
        <textarea
          className='min-h-24 rounded-md border border-dark/12 bg-cream px-3 py-3 text-sm text-dark outline-none transition-colors focus:border-olive'
          value={approvalReason}
          onChange={(event) => setApprovalReason(event.target.value)}
          disabled={disabled || isSubmitting}
          placeholder='Opcional: por qué se aprueba esta postulación.'
        />
      </label>
      <label className='flex flex-col gap-2'>
        <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
          Motivo de rechazo
        </span>
        <textarea
          className='min-h-28 rounded-md border border-dark/12 bg-cream px-3 py-3 text-sm text-dark outline-none transition-colors focus:border-olive'
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
          disabled={disabled || isSubmitting}
          placeholder='Opcional: por qué se rechaza esta postulación.'
        />
      </label>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Button
          type='button'
          onClick={() => submitAction('approve')}
          disabled={disabled || isSubmitting}
          className='h-auto gap-2 px-5 py-3 text-sm'
        >
          <Check className='size-4' />
          Aprobar
        </Button>
        <Button
          type='button'
          onClick={() => submitAction('reject')}
          disabled={disabled || isSubmitting}
          variant='outline'
          className='h-auto gap-2 border-dark/12 bg-transparent px-5 py-3 text-sm'
        >
          <X className='size-4' />
          Rechazar
        </Button>
      </div>
      {canApproveWithoutEmail ? (
        <div className='space-y-3 border border-energy/35 bg-energy/10 p-4 text-dark'>
          <p className='text-sm font-semibold'>La invitación no se envió.</p>
          <p className='text-sm leading-6 text-dark/70'>
            Puedes aprobar igualmente. Se creará la cuenta sin correo y aparecerá una contraseña
            temporal para entregársela al usuario por otro medio seguro.
          </p>
          <Button
            type='button'
            onClick={() => submitAction('approve', true)}
            disabled={disabled || isSubmitting}
            variant='outline'
            className='h-auto border-energy/50 bg-transparent px-5 py-3 text-sm text-dark hover:bg-energy/10'
          >
            Aprobar sin enviar correo
          </Button>
        </div>
      ) : null}
      {temporaryPassword ? (
        <div className='space-y-3 border border-olive/35 bg-olive/10 p-4 text-dark'>
          <div>
            <p className='text-sm font-semibold'>Contraseña temporal creada</p>
            <p className='mt-1 text-xs leading-5 text-dark/60'>
              Se muestra una sola vez. Entrégala al usuario de forma segura; al ingresar tendrá que
              reemplazarla.
            </p>
          </div>
          <code className='block overflow-x-auto border border-dark/10 bg-cream px-3 py-3 text-sm font-semibold'>
            {temporaryPassword}
          </code>
          <button
            type='button'
            onClick={async () => {
              await navigator.clipboard.writeText(temporaryPassword);
              setPasswordCopied(true);
            }}
            className='inline-flex min-h-10 items-center gap-2 border border-dark/15 px-3 text-sm font-semibold text-dark/70 transition-colors hover:border-dark/30 hover:text-dark'
          >
            <Copy className='size-4' />
            {passwordCopied ? 'Copiada' : 'Copiar contraseña'}
          </button>
        </div>
      ) : null}
      <div className='border-t border-dark/10 pt-4'>
        <DestructiveConfirmation
          disabled={isSubmitting}
          title='Eliminar postulación'
          description='Esta acción elimina definitivamente la postulación y sus datos de revisión. Si ya se creó una cuenta para esta persona, la cuenta no será eliminada.'
          confirmLabel='Eliminar postulación'
          onConfirm={deleteApplication}
        >
          <span className='inline-flex min-h-11 items-center gap-2 bg-red-800 px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 aria-disabled:opacity-50'>
            <Trash2 className='size-4' />
            Eliminar postulación
          </span>
        </DestructiveConfirmation>
      </div>
      {message ? <p className='text-sm leading-6 text-dark/70'>{message}</p> : null}
    </section>
  );
}
