'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import DestructiveConfirmation from '@/components/destructive-confirmation';

export default function AdminPostSuperActions({ postId }: { postId: string }) {
  const router = useRouter();

  async function deletePost() {
    const response = await fetch(`/api/admin/posts/${postId}/delete`, {
      method: 'POST',
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'No se pudo borrar la publicación.');
    }

    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <section className='space-y-3 border border-dark/10 bg-white/30 p-5'>
      <h2 className='font-display text-2xl font-semibold'>Superadmin</h2>
      <Link
        href={`/admin/posts/${postId}/editar`}
        className='flex min-h-11 items-center gap-2 border border-dark/12 px-4 text-sm font-semibold text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
      >
        <Pencil className='size-4' />
        Editar publicación
      </Link>
      <DestructiveConfirmation
        title='Borrar publicación'
        description='Esta acción elimina la publicación y sus relaciones en cascada, como comentarios, votos y revisiones. No se puede deshacer desde el panel.'
        confirmLabel='Borrar publicación'
        onConfirm={deletePost}
      >
        <span className='inline-flex min-h-11 w-full items-center gap-2 bg-red-800 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90'>
          <Trash2 className='size-4' />
          Borrar publicación
        </span>
      </DestructiveConfirmation>
    </section>
  );
}
