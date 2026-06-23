import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminPostActions from '@/components/admin-post-actions';
import AdminPostSuperActions from '@/components/admin-post-super-actions';
import BackButton from '@/components/back-button';
import NoAccess from '@/components/no-access';
import { isSuperAdmin } from '@/lib/auth/roles';
import { requireAdminAccess } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPostDetailPage({ params }: PageProps) {
  const { roles, allowed } = await requireAdminAccess();

  if (!allowed) return <NoAccess />;

  const { id } = await params;
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: post } = await supabaseAdmin.from('posts').select('*').eq('id', id).maybeSingle();

  if (!post) notFound();

  const [{ data: author }, { data: approver }] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('display_name,nombres,apellidos')
      .eq('id', post.author_id)
      .maybeSingle(),
    post.approved_by
      ? supabaseAdmin
          .from('profiles')
          .select('display_name,nombres,apellidos')
          .eq('id', post.approved_by)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <section className='grid gap-6 py-10 lg:grid-cols-[1fr_360px]'>
      <div>
        <div className='mb-8'>
          <BackButton fallbackHref='/admin/posts' label='Volver' />
        </div>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>
          <Link href={`/miembros/${post.author_id}`} className='transition-opacity hover:opacity-60'>
            {getProfileName(author)}
          </Link>{' '}
          · {post.status}
        </p>
        <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight'>
          {post.title}
        </h1>
        <p className='mt-5 max-w-2xl text-base leading-7 text-dark/68'>{post.excerpt}</p>

        {post.cover_image_url ? (
          <div className='relative mt-8 aspect-[16/9] overflow-hidden border border-dark/10'>
            <Image src={post.cover_image_url} alt='' fill sizes='100vw' className='object-cover' />
          </div>
        ) : null}

        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          <DetailGroup title='Auditoría'>
            <Detail label='Creado' value={formatDate(post.created_at)} />
            <Detail label='Enviado a revisión' value={formatDate(post.submitted_at)} />
            <Detail label='Editado' value={formatDate(post.edited_at)} />
            <Detail
              label='Aprobado por'
              value={
                post.approved_by ? (
                  <Link
                    href={`/miembros/${post.approved_by}`}
                    className='font-semibold transition-colors hover:text-olive'
                  >
                    {getProfileName(approver)}
                  </Link>
                ) : (
                  'Pendiente'
                )
              }
            />
            <Detail label='Aprobado' value={formatDate(post.approved_at)} />
            <Detail label='Publicado' value={formatDate(post.published_at)} />
            <Detail label='Último cambio' value={formatDate(post.edited_at ?? post.updated_at ?? post.approved_at)} />
          </DetailGroup>
          <DetailGroup title='Revisión'>
            <Detail label='Notas' value={post.review_notes || 'Sin notas'} />
            <Detail label='Visibilidad' value={post.visibility} />
          </DetailGroup>
        </div>

        <div className='mt-8 whitespace-pre-wrap border border-dark/10 bg-white/25 p-5 text-base leading-8 text-dark/78'>
          {post.content}
        </div>
      </div>

      <div className='space-y-4'>
        <AdminPostActions postId={post.id} status={post.status} />
        {isSuperAdmin(roles) ? <AdminPostSuperActions postId={post.id} /> : null}
      </div>
    </section>
  );
}

function DetailGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className='space-y-3 border border-dark/10 bg-white/25 p-5'>
      <h2 className='font-display text-2xl font-semibold'>{title}</h2>
      {children}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='border-t border-dark/10 pt-3'>
      <p className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>{label}</p>
      <p className='mt-1 text-sm leading-6 text-dark/75'>{value}</p>
    </div>
  );
}

function getProfileName(profile: {
  display_name?: string | null;
  nombres?: string | null;
  apellidos?: string | null;
} | null) {
  return profile?.display_name || [profile?.nombres, profile?.apellidos].filter(Boolean).join(' ') || 'Kriuu';
}

function formatDate(value: string | null) {
  if (!value) return 'Pendiente';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
