import Link from 'next/link';
import { AtSign, BriefcaseBusiness, Camera, Code2, ExternalLink, Globe } from 'lucide-react';

export type SocialLinksValue = {
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  instagram_url?: string | null;
  website_url?: string | null;
};

const SOCIALS = [
  { key: 'github_url', label: 'GitHub', Icon: Code2 },
  { key: 'linkedin_url', label: 'LinkedIn', Icon: BriefcaseBusiness },
  { key: 'twitter_url', label: 'X / Twitter', Icon: AtSign },
  { key: 'instagram_url', label: 'Instagram', Icon: Camera },
  { key: 'website_url', label: 'Sitio web', Icon: Globe },
] as const;

export default function SocialLinks({ links }: { links: SocialLinksValue | null }) {
  const visibleLinks = SOCIALS.map((social) => ({
    ...social,
    href: links?.[social.key],
  })).filter((social) => Boolean(social.href));

  if (!visibleLinks.length) {
    return (
      <p className='border border-dark/10 bg-white/25 p-4 text-sm leading-6 text-dark/62'>
        Esta persona todavía no ha agregado redes públicas.
      </p>
    );
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {visibleLinks.map(({ href, Icon, label }) => (
        <Link
          key={label}
          href={href ?? '#'}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex min-h-11 items-center gap-2 border border-dark/12 px-3 text-sm font-semibold text-dark/72 transition-colors hover:border-dark/25 hover:text-dark'
        >
          <Icon className='size-4' />
          {label}
          <ExternalLink className='size-3.5' />
        </Link>
      ))}
    </div>
  );
}
