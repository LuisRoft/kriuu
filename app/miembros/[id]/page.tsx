import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { notFound } from 'next/navigation';
import BackButton from '@/components/back-button';
import SocialLinks from '@/components/social-links';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemberProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select(
      'id,display_name,nombres,apellidos,avatar_url,bio,ciudad,parroquia,carrera,telefono,status,github_url,linkedin_url,twitter_url,instagram_url,website_url',
    )
    .eq('id', id)
    .maybeSingle();
  const { data: authResult } = await supabaseAdmin.auth.admin.getUserById(id);
  const authUser = authResult.user;
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('id,title,slug,excerpt,cover_image_url,published_at,visibility')
    .eq('author_id', id)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (!profile && !authUser) notFound();

  const displayName =
    profile?.display_name ||
    [profile?.nombres, profile?.apellidos].filter(Boolean).join(' ') ||
    authUser?.email ||
    'Miembro Kriuu';

  return (
    <main className='min-h-screen bg-cream px-5 py-6 text-dark md:px-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8'>
          <BackButton fallbackHref='/posts' label='Volver' />
        </div>

        <section className='py-10'>
          <div className='grid gap-8 md:grid-cols-[160px_1fr] md:items-start'>
            <div className='relative size-32 overflow-hidden border border-dark/10 bg-white/25 md:size-40'>
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt=''
                  fill
                  sizes='(min-width: 768px) 160px, 128px'
                  className='object-cover'
                />
              ) : (
                <div className='flex size-full items-center justify-center font-display text-5xl text-dark/30'>
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Perfil</p>
              <h1 className='mt-4 font-display text-5xl font-semibold leading-none tracking-tight md:text-7xl'>
                {displayName}
              </h1>
              <div className='mt-5 flex flex-wrap gap-3 text-sm leading-6 text-dark/62'>
                {profile?.carrera ? <span>{profile.carrera}</span> : null}
                {profile?.ciudad ? (
                  <span className='inline-flex items-center gap-1'>
                    <MapPin className='size-4' />
                    {profile.ciudad}
                    {profile.parroquia ? `, ${profile.parroquia}` : ''}
                  </span>
                ) : null}
              </div>
              {profile?.bio ? (
                <p className='mt-6 max-w-2xl text-base leading-7 text-dark/68'>{profile.bio}</p>
              ) : (
                <p className='mt-6 max-w-2xl text-base leading-7 text-dark/58'>
                  Esta persona todavía no ha agregado una bio pública.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className='grid gap-5 border-t border-dark/10 py-8 md:grid-cols-2'>
          <div>
            <h2 className='font-display text-3xl font-semibold'>Contacto</h2>
            <div className='mt-5 space-y-3'>
              {authUser?.email ? (
                <ContactRow icon={<Mail className='size-4' />} label='Correo' value={authUser.email} />
              ) : null}
              {profile?.telefono ? (
                <ContactRow icon={<Phone className='size-4' />} label='Teléfono' value={profile.telefono} />
              ) : (
                <p className='border border-dark/10 bg-white/25 p-4 text-sm leading-6 text-dark/62'>
                  No ha agregado teléfono público.
                </p>
              )}
            </div>
          </div>
          <div>
            <h2 className='font-display text-3xl font-semibold'>Redes</h2>
            <div className='mt-5'>
              <SocialLinks links={profile} />
            </div>
          </div>
        </section>

        <section className='border-t border-dark/10 py-8'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>
                Publicaciones
              </p>
              <h2 className='mt-3 font-display text-3xl font-semibold'>Posts publicados</h2>
            </div>
          </div>
          {posts?.length ? (
            <div className='mt-6 grid gap-4 md:grid-cols-2'>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className='group border border-dark/10 bg-white/25 transition-colors hover:border-dark/25'
                >
                  {post.cover_image_url ? (
                    <div className='relative aspect-[16/9] overflow-hidden border-b border-dark/10'>
                      <Image
                        src={post.cover_image_url}
                        alt=''
                        fill
                        sizes='(min-width: 768px) 50vw, 100vw'
                        className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                      />
                    </div>
                  ) : null}
                  <div className='p-4'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <VisibilityBadge visibility={post.visibility} />
                      <span className='text-xs font-medium uppercase tracking-widest text-dark/45'>
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                    <h3 className='mt-3 font-display text-2xl font-semibold leading-none text-dark'>
                      {post.title}
                    </h3>
                    <p className='mt-3 text-sm leading-6 text-dark/65'>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className='mt-6 border border-dark/10 bg-white/25 p-5 text-sm leading-6 text-dark/62'>
              Este usuario aún no ha publicado posts.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='border border-dark/10 bg-white/25 p-4'>
      <p className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>
        {icon}
        {label}
      </p>
      <p className='mt-2 break-words text-sm leading-6 text-dark/75'>{value}</p>
    </div>
  );
}

function VisibilityBadge({ visibility }: { visibility: string | null }) {
  const membersOnly = visibility === 'members_only';

  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2 text-xs font-semibold uppercase tracking-[0.14em] ${
        membersOnly
          ? 'border-olive/25 bg-olive/10 text-olive'
          : 'border-dark/12 bg-white/40 text-dark/62'
      }`}
    >
      {membersOnly ? 'Solo miembros' : 'Para todos'}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return 'Publicado';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}
