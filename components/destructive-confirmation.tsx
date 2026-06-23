'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function DestructiveConfirmation({
  children,
  confirmLabel = 'Eliminar',
  description,
  disabled = false,
  onConfirm,
  title,
}: {
  children: React.ReactNode;
  confirmLabel?: string;
  description: string;
  disabled?: boolean;
  onConfirm: () => Promise<void> | void;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  async function confirm() {
    setIsConfirming(true);

    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <>
      <button type='button' disabled={disabled} onClick={() => setIsOpen(true)} className='contents'>
        {children}
      </button>

      {isOpen ? (
        <div className='fixed inset-0 z-[1200] flex items-center justify-center px-4 py-6'>
          <button
            type='button'
            aria-label='Cerrar confirmación'
            onClick={() => setIsOpen(false)}
            className='absolute inset-0 bg-dark/45 backdrop-blur-[2px]'
          />
          <section className='relative z-10 w-full max-w-md border border-dark/10 bg-cream p-5 text-dark shadow-2xl md:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-red-800'>
                  Acción irreversible
                </p>
                <h2 className='mt-2 font-display text-3xl font-semibold leading-none'>{title}</h2>
              </div>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='flex size-10 shrink-0 items-center justify-center border border-dark/12 text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
                aria-label='Cerrar'
              >
                <X className='size-5' />
              </button>
            </div>
            <p className='mt-4 text-sm leading-6 text-dark/68'>{description}</p>
            <div className='mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='min-h-11 border border-dark/12 px-4 text-sm font-semibold text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
              >
                Cancelar
              </button>
              <button
                type='button'
                disabled={isConfirming}
                onClick={confirm}
                className='min-h-11 bg-red-800 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50'
              >
                {isConfirming ? 'Eliminando...' : confirmLabel}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
