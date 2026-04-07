import { HugeiconsIcon } from '@hugeicons/react';
import {
  Rocket01Icon,
  SourceCodeSquareIcon,
  PaintBrush04Icon,
} from '@hugeicons/core-free-icons';

const ROLES = [
  {
    icon: Rocket01Icon,
    title: 'Founders',
    desc: 'Visionaries deploying capital and strategy to solve structural problems in the region. From fintech to agrotech.',
    tags: ['Capital Networks', 'Strategy Labs', 'Growth Frameworks'],
  },
  {
    icon: SourceCodeSquareIcon,
    title: 'Engineers',
    desc: 'The bedrock of the lab. Building scalable, robust systems that handle the complexity of emerging markets.',
    tags: ['Technical Workshops', 'Open Source Collabs', 'Architecture Audits'],
  },
  {
    icon: PaintBrush04Icon,
    title: 'Designers',
    desc: 'Creating intuitive, beautiful interfaces that humanize complex technology for the next billion users.',
    tags: ['Visual Systems', 'UX Research Hub', 'Product Critiques'],
  },
] as const;

export default function Ecosistema() {
  return (
    <section
      id='ecosistema'
      className='bg-white px-5 py-20 md:px-12 md:py-32 lg:px-48'
    >
      <p className='text-xs font-medium uppercase tracking-widest text-olive'>
        Our DNA
      </p>
      <h2 className='mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-dark md:text-5xl'>
        The Builder Ecosystem
      </h2>

      <div className='mt-12 grid grid-cols-1 border border-olive/15 md:mt-16 md:grid-cols-3'>
        {ROLES.map(({ icon, title, desc, tags }) => (
          <article
            key={title}
            className='flex flex-col gap-5 border border-olive/15 p-6 md:p-10'
          >
            <HugeiconsIcon
              icon={icon}
              strokeWidth={1.5}
              className='size-8 text-dark'
            />

            <h3 className='font-display text-2xl font-semibold text-dark md:text-3xl'>
              {title}
            </h3>

            <p className='text-sm leading-relaxed text-dark/60 md:text-base'>
              {desc}
            </p>

            <ul className='mt-auto flex flex-col gap-1.5 pt-4'>
              {tags.map((tag) => (
                <li
                  key={tag}
                  className='text-xs font-medium uppercase tracking-widest text-dark/40'
                >
                  — {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
