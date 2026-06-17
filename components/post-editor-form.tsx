'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

type PostEditorInitialValue = {
  content: string;
  excerpt: string;
  title: string;
  visibility: string;
};

export default function PostEditorForm({
  initialValue,
  mode = 'create',
  postId,
  redirectTo = '/posts',
}: {
  initialValue?: PostEditorInitialValue;
  mode?: 'create' | 'edit';
  postId?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(
        mode === 'edit' && postId ? `/api/admin/posts/${postId}/update` : '/api/posts/create',
        {
          method: 'POST',
          body: formData,
        },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo enviar la publicación.');
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo enviar la publicación.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitPost} className='space-y-5 border border-dark/10 bg-white/30 p-5 md:p-7'>
      <Field label='Título'>
        <input className={inputClass} name='title' defaultValue={initialValue?.title ?? ''} required />
      </Field>
      <Field label='Descripción'>
        <textarea
          className={`${inputClass} min-h-28 py-3 leading-6`}
          name='excerpt'
          defaultValue={initialValue?.excerpt ?? ''}
          required
        />
      </Field>
      <Field label='Contenido'>
        <textarea
          className={`${inputClass} min-h-72 py-3 leading-6`}
          name='content'
          defaultValue={initialValue?.content ?? ''}
          required
        />
      </Field>
      <fieldset className='flex flex-col gap-2'>
        <legend className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
          Visibilidad
        </legend>
        <div className='grid gap-2 sm:grid-cols-2'>
          <label className='flex min-h-11 cursor-pointer items-center gap-3 border border-dark/12 bg-cream px-3 text-sm font-semibold text-dark/70'>
            <input
              type='radio'
              name='visibility'
              value='members_only'
              defaultChecked={(initialValue?.visibility ?? 'members_only') === 'members_only'}
            />
            Solo miembros
          </label>
          <label className='flex min-h-11 cursor-pointer items-center gap-3 border border-dark/12 bg-cream px-3 text-sm font-semibold text-dark/70'>
            <input
              type='radio'
              name='visibility'
              value='public'
              defaultChecked={initialValue?.visibility === 'public'}
            />
            Público
          </label>
        </div>
      </fieldset>
      <Field label='Foto de portada'>
        <label className='flex min-h-24 cursor-pointer items-center justify-center gap-3 border border-dashed border-dark/20 bg-cream px-4 text-sm font-semibold text-dark/62 transition-colors hover:border-dark/35 hover:text-dark'>
          <ImagePlus className='size-5' />
          <span>Subir portada opcional</span>
          <input className='sr-only' name='cover' type='file' accept='image/*' />
        </label>
      </Field>
      <Button
        type='submit'
        disabled={isSubmitting}
        className='h-auto gap-2 px-6 py-3.5 text-sm font-semibold'
      >
        {mode === 'edit' ? (
          <>
            <Save className='size-4' />
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </>
        ) : (
          <>
            <Send className='size-4' />
            {isSubmitting ? 'Enviando...' : 'Enviar a revisión'}
          </>
        )}
      </Button>
      {message ? (
        <p className='border border-red-900/15 bg-red-900/8 px-4 py-3 text-sm font-medium text-red-800'>
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className='flex flex-col gap-2'>
      <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
        {label}
      </span>
      {children}
    </label>
  );
}
