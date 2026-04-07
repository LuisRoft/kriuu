import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { MessageMultiple02Icon } from '@hugeicons/core-free-icons';

export default function JoinCta() {
  return (
    <section
      id='join'
      className='relative overflow-hidden px-5 py-20 md:px-12 md:py-32 lg:px-48'
    >
      <Image
        src='/bgs/bg-cta.png'
        alt=''
        fill
        className='pointer-events-none object-cover'
      />
      <div className='relative z-10 flex flex-col items-center gap-6 bg-electric px-5 py-14 text-center md:px-16 md:py-24'>
        <div className='border border-white/60 p-4'>
          <HugeiconsIcon
            icon={MessageMultiple02Icon}
            strokeWidth={1.5}
            className='size-10 text-white/60'
          />
        </div>

        <h2 className='max-w-2xl font-display text-3xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl'>
          Connect in Real-Time
        </h2>

        <p className='max-w-2xl text-sm leading-relaxed text-white/60 md:text-base'>
          Our WhatsApp Community is the central nervous system of LATAM
          BUILDERS. Join 1,400+ builders sharing insights, jobs, and support.
        </p>

        <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
          <Button
            className='h-auto bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-electric hover:bg-lime'
            variant='ghost'
            asChild
          >
            <Link
              href='https://chat.whatsapp.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              Join WhatsApp Community
            </Link>
          </Button>

          <Button
            className='h-auto border border-white/30 bg-transparent px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white/70 hover:bg-lime'
            variant='ghost'
            asChild
          >
            <Link
              href='https://x.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              Follow on X
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
