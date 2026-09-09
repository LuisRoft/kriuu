import Image from 'next/image';

const EVENTS = [
  {
    name: 'Zero to Builder',
    city: 'Portoviejo',
    accent: 'bg-lime',
  },
  {
    name: 'Zero to Builder',
    city: 'Manta',
    accent: 'bg-energy',
  },
  {
    name: 'OpenAI Buildathon',
    city: 'Portoviejo',
    accent: 'bg-electric',
  },
  {
    name: 'OpenAI Buildathon',
    city: 'Manta',
    accent: 'bg-olive',
  },
];

const EVENT_PHOTOS = [
  '/moments/kriuu-2.webp',
  '/moments/kriuu-4.webp',
  '/moments/kriuu-7.webp',
];

export default function Events() {
  return (
    <section
      id='eventos'
      className='scroll-mt-20 border-t border-dark/10 bg-dark px-5 py-16 text-cream md:px-8 md:py-24'
    >
      <div className='mx-auto max-w-7xl'>
        <p className='text-xs font-medium uppercase tracking-widest text-cream/50'>Eventos de Kriuu</p>
        <div className='mt-4 grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-end'>
          <h2 className='font-display text-5xl font-semibold leading-none tracking-tight md:text-7xl'>
            Nos encontramos para hacer.
          </h2>
          <p className='max-w-xl text-[15px] leading-7 text-cream/65 md:justify-self-end'>
            Eventos organizados por Kriuu para reunir a la comunidad de tecnología e IA,
            aprender en conjunto y construir desde Manabí.
          </p>
        </div>

        <div className='mt-10 grid gap-px bg-cream/15 sm:grid-cols-2 lg:grid-cols-4'>
          {EVENTS.map((event, index) => (
            <article
              key={`${event.name}-${event.city}`}
              className='relative min-h-52 overflow-hidden bg-dark p-5'
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${event.accent}`} />
              <p className='text-xs font-medium uppercase tracking-[0.18em] text-cream/45'>
                Evento {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className='mt-10 font-display text-3xl font-semibold leading-none'>{event.name}</h3>
              <p className='mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-cream/60'>
                {event.city} · Ecuador
              </p>
            </article>
          ))}
        </div>

        <div className='mt-px grid gap-px bg-cream/15 md:grid-cols-3'>
          {EVENT_PHOTOS.map((src, index) => (
            <div key={src} className='relative aspect-[4/3] overflow-hidden bg-cream/5'>
              <Image
                src={src}
                alt={`La comunidad de Kriuu en uno de sus eventos ${index + 1}`}
                fill
                sizes='(min-width: 768px) 33vw, 100vw'
                className='object-cover transition-transform duration-500 hover:scale-[1.03]'
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
