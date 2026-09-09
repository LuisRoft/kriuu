import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import ReadingCarousel from '@/components/reading-carousel';

export default async function BlogPreview() {
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('id,title,slug,excerpt,cover_image_url,published_at,visibility')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(9);

  if (!posts?.length) return null;

  return (
    <section id='blog' className='border-t border-dark/10 bg-cream px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto max-w-7xl'>
        <ReadingCarousel posts={posts} />
      </div>
    </section>
  );
}
