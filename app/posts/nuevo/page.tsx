import BackButton from '@/components/back-button';
import PostEditorForm from '@/components/post-editor-form';
import NoAccess from '@/components/no-access';
import { requirePlatformAccess } from '@/lib/auth/session';

export default async function NewPostPage() {
  const { allowed } = await requirePlatformAccess();

  if (!allowed) return <NoAccess />;

  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8'>
          <BackButton fallbackHref='/posts' label='Volver' />
        </div>
        <section className='py-10'>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Publicar</p>
          <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
            Envía una idea a revisión.
          </h1>
          <p className='mt-5 max-w-2xl text-base leading-7 text-dark/68'>
            Escribe el título, una descripción y el contenido. Un admin revisará la publicación antes de que aparezca para la comunidad.
          </p>
          <div className='mt-8'>
            <PostEditorForm />
          </div>
        </section>
      </div>
    </main>
  );
}
