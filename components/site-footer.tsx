import Link from 'next/link';

const FOOTER_LINKS = [
  { href: 'https://chat.whatsapp.com', label: 'WhatsApp Community' },
  { href: 'https://x.com', label: 'Twitter/X' },
  { href: 'https://github.com', label: 'GitHub' },
  { href: '/legal', label: 'Legal' },
] as const;

export default function SiteFooter() {
  return (
    <footer className='bg-white px-5 py-12 md:px-12 md:py-14 lg:px-48'>
      <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
        <div>
          <p className='text-xl font-black text-dark md:text-2xl'>kriuu.</p>
          <p className='mt-2 text-xs uppercase tracking-widest text-dark/40'>
            &copy; 2026 Kriuu. Engineered in Latam.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-6 md:gap-8'>
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className='text-xs uppercase tracking-widest text-dark/50 underline underline-offset-4 transition-colors hover:text-dark'
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
