'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPostActions({
  postId,
  status,
}: {
  postId: string;
  status: string;
}) {
  const router = useRouter();
  const [reviewNotes, setReviewNotes] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitAction(action: 'approve' | 'reject' | 'review') {
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/posts/${postId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewNotes }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo completar la revisión.');
      }

      setMessage(result.message);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar la revisión.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className='space-y-4 border border-dark/10 bg-white/30 p-5'>
      <h2 className='font-display text-2xl font-semibold'>Revisión</h2>
      <label className='flex flex-col gap-2'>
        <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
          Notas de revisión
        </span>
        <textarea
          className='min-h-28 rounded-md border border-dark/12 bg-cream px-3 py-3 text-sm text-dark outline-none transition-colors focus:border-olive'
          value={reviewNotes}
          onChange={(event) => setReviewNotes(event.target.value)}
          disabled={(status !== 'in_review' && status !== 'published') || isSubmitting}
          placeholder='Opcional: motivo de aprobación, rechazo o cambios solicitados.'
        />
      </label>
      {status === 'in_review' ? (
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button
            type='button'
            onClick={() => submitAction('approve')}
            disabled={isSubmitting}
            className='h-auto gap-2 px-5 py-3 text-sm'
          >
            <Check className='size-4' />
            Aprobar y publicar
          </Button>
          <Button
            type='button'
            onClick={() => submitAction('reject')}
            disabled={isSubmitting}
            variant='outline'
            className='h-auto gap-2 border-dark/12 bg-transparent px-5 py-3 text-sm'
          >
            <X className='size-4' />
            Rechazar
          </Button>
        </div>
      ) : null}
      {status === 'published' ? (
        <Button
          type='button'
          onClick={() => submitAction('review')}
          disabled={isSubmitting}
          variant='outline'
          className='h-auto gap-2 border-dark/12 bg-transparent px-5 py-3 text-sm'
        >
          <RotateCcw className='size-4' />
          Retirar y enviar a revisión
        </Button>
      ) : null}
      {status !== 'in_review' && status !== 'published' ? (
        <p className='text-sm leading-6 text-dark/62'>
          Esta publicación no tiene acciones pendientes en este estado.
        </p>
      ) : null}
      {message ? <p className='text-sm leading-6 text-dark/70'>{message}</p> : null}
    </section>
  );
}
