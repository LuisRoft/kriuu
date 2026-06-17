import { notFound } from 'next/navigation';
import BackButton from '@/components/back-button';
import PostEditorForm from '@/components/post-editor-form';
import NoAccess from '@/components/no-access';
import { isSuperAdmin } from '@/lib/auth/roles';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditPostPage({ params }: PageProps) {
  const { roles, allowed } = await requireAdminAccess();

  if (!allowed || !isSuperAdmin(roles)) return <NoAccess />;

  const { id } = await params;
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('id,title,excerpt,content,visibility')
    .eq('id', id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <section className='py-10'>
      <div className='mb-8'>
        <BackButton fallbackHref={`/admin/posts/${id}`} label='Volver' />
      </div>
      <div className='mt-8 max-w-4xl'>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Superadmin</p>
        <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
          Editar publicación.
        </h1>
        <p className='mt-5 max-w-2xl text-base leading-7 text-dark/68'>
          Puedes cambiar el contenido, visibilidad y portada. Si cambias el título, también se regenerará el slug.
        </p>
        <div className='mt-8'>
          <PostEditorForm
            mode='edit'
            postId={id}
            redirectTo={`/admin/posts/${id}`}
            initialValue={{
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              visibility: post.visibility,
            }}
          />
        </div>
      </div>
    </section>
  );
}
