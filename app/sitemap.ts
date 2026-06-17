import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseAdmin = createAdminSupabaseClient();
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('slug,updated_at,published_at,visibility')
    .eq('status', 'published');

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...(posts?.map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.published_at ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: post.visibility === 'public' ? 0.85 : 0.55,
    })) ?? []),
  ];
}
