import Image from 'next/image';
import Link from 'next/link';

const FOOTER_LINKS = [
  { href: 'https://chat.whatsapp.com', label: 'WhatsApp' },
  { href: 'https://x.com/kriuu', label: 'Twitter/X' },
  { href: 'https://github.com/kriuu', label: 'GitHub' },
  { href: 'https://linkedin.com/company/kriuu', label: 'LinkedIn' },
] as const;

export default function SiteFooter() {
  return (
    <footer className='border-t border-dark/[0.08] bg-cream py-12 md:py-14'>
      <div className='mx-auto max-w-[1280px] px-5 md:px-8'>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-2.5'>
          <Image src='/logo.svg' alt='kriuu' width={22} height={22} />
          <p className='text-sm text-dark/50'>
            © 2026 Kriuu. Construido en Latam.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={
                href.startsWith('http') ? 'noopener noreferrer' : undefined
              }
              className='text-sm text-dark/50 transition-colors hover:text-dark'
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      </div>
    </footer>
  );
}
