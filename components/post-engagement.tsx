'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Pencil, ThumbsUp, Trash2 } from 'lucide-react';
import DestructiveConfirmation from '@/components/destructive-confirmation';
import { Button } from '@/components/ui/button';

type Comment = {
  authorName: string;
  canDelete: boolean;
  canEdit: boolean;
  content: string;
  createdAt: string;
  editedAt: string | null;
  id: string;
};

export default function PostEngagement({
  comments,
  hasVoted,
  postId,
  voteCount,
}: {
  comments: Comment[];
  hasVoted: boolean;
  postId: string;
  voteCount: number;
}) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [message, setMessage] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  async function toggleVote() {
    setMessage('');
    setIsVoting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/vote`, { method: 'POST' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo registrar el voto.');
      }

      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo registrar el voto.');
    } finally {
      setIsVoting(false);
    }
  }

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!content.trim()) {
      setMessage('Escribe un comentario antes de enviarlo.');
      return;
    }

    setIsCommenting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo publicar el comentario.');
      }

      setContent('');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo publicar el comentario.');
    } finally {
      setIsCommenting(false);
    }
  }

  async function updateComment(commentId: string) {
    setMessage('');

    if (!editingContent.trim()) {
      setMessage('El comentario no puede quedar vacío.');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo editar el comentario.');
      }

      setEditingCommentId('');
      setEditingContent('');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo editar el comentario.');
    }
  }

  async function deleteComment(commentId: string) {
    setMessage('');

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo borrar el comentario.');
      }

      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo borrar el comentario.');
    }
  }

  return (
    <section className='border-t border-dark/10 py-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-4 text-sm font-semibold text-dark/70'>
          <span className='inline-flex items-center gap-2'>
            <ThumbsUp className='size-4' />
            {voteCount} upvotes
          </span>
          <span className='inline-flex items-center gap-2'>
            <MessageSquare className='size-4' />
            {comments.length} comentarios
          </span>
        </div>
        <Button
          type='button'
          onClick={toggleVote}
          disabled={isVoting}
          className='h-auto gap-2 px-5 py-3 text-sm'
          variant={hasVoted ? 'outline' : 'default'}
        >
          <ThumbsUp className='size-4' />
          {hasVoted ? 'Quitar upvote' : 'Dar upvote'}
        </Button>
      </div>

      <form onSubmit={submitComment} className='mt-8 space-y-3'>
        <label className='flex flex-col gap-2'>
          <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
            Comentar
          </span>
          <textarea
            className='min-h-28 rounded-md border border-dark/12 bg-cream px-3 py-3 text-sm text-dark outline-none transition-colors focus:border-olive'
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder='Suma una idea, pregunta o lectura.'
          />
        </label>
        <Button
          type='submit'
          disabled={isCommenting}
          className='h-auto px-5 py-3 text-sm'
        >
          {isCommenting ? 'Publicando...' : 'Publicar comentario'}
        </Button>
      </form>

      {message ? (
        <p className='mt-4 border border-red-900/15 bg-red-900/8 px-4 py-3 text-sm font-medium text-red-800'>
          {message}
        </p>
      ) : null}

      <div className='mt-8 space-y-4'>
        <h2 className='font-display text-3xl font-semibold'>Comentarios</h2>
        {comments.map((comment) => (
          <article key={comment.id} className='border border-dark/10 bg-white/25 p-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>
                  {comment.authorName} · {formatDate(comment.createdAt)}
                  {comment.editedAt ? ` · editado ${formatDate(comment.editedAt)}` : ''}
                </p>
                {editingCommentId === comment.id ? (
                  <textarea
                    className='mt-3 min-h-24 w-full rounded-md border border-dark/12 bg-cream px-3 py-3 text-sm text-dark outline-none transition-colors focus:border-olive sm:min-w-120'
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                  />
                ) : (
                  <p className='mt-3 whitespace-pre-wrap text-sm leading-6 text-dark/75'>
                    {comment.content}
                  </p>
                )}
              </div>
              {(comment.canEdit || comment.canDelete) ? (
                <div className='flex shrink-0 gap-2'>
                  {comment.canEdit ? (
                    editingCommentId === comment.id ? (
                      <>
                        <button
                          type='button'
                          onClick={() => updateComment(comment.id)}
                          className='min-h-9 border border-dark/12 px-3 text-xs font-semibold text-dark/70'
                        >
                          Guardar
                        </button>
                        <button
                          type='button'
                          onClick={() => {
                            setEditingCommentId('');
                            setEditingContent('');
                          }}
                          className='min-h-9 border border-dark/12 px-3 text-xs font-semibold text-dark/70'
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        type='button'
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingContent(comment.content);
                        }}
                        className='flex size-9 items-center justify-center border border-dark/12 text-dark/70'
                        aria-label='Editar comentario'
                      >
                        <Pencil className='size-4' />
                      </button>
                    )
                  ) : null}
                  {comment.canDelete ? (
                    <DestructiveConfirmation
                      title='Borrar comentario'
                      description='El comentario dejará de aparecer en la publicación. Esta acción queda registrada como borrado lógico.'
                      confirmLabel='Borrar comentario'
                      onConfirm={() => deleteComment(comment.id)}
                    >
                      <span
                        className='flex size-9 items-center justify-center border border-dark/12 text-dark/70'
                        aria-label='Borrar comentario'
                      >
                        <Trash2 className='size-4' />
                      </span>
                    </DestructiveConfirmation>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        ))}
        {!comments.length ? (
          <p className='border border-dark/10 bg-white/25 p-4 text-sm text-dark/62'>
            Sé la primera persona en comentar.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
