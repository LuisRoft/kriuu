'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitAction(action: 'approve' | 'reject') {
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalReason, rejectionReason }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo completar la acción.');
      }

      setMessage(result.message);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar la acción.');
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
      {message ? <p className='text-sm leading-6 text-dark/70'>{message}</p> : null}
    </section>
  );
}
