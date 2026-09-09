import Image from 'next/image';

const EVENTS = [
  {
    name: 'Zero to Builder',
    city: 'Portoviejo',
    location: 'PUCE Manabí · Campus Portoviejo',
    description:
      'Una edición centrada en construir en vivo: los asistentes crearon un agente de IA paso a paso y cerraron la jornada con una charla de un profesional de Oracle sobre su experiencia construyendo tecnología a gran escala.',
    accent: 'bg-lime',
  },
  {
    name: 'Zero to Builder',
    city: 'Manta',
    location: 'PUCE Manabí · Campus Manta',
    description:
      'El primer encuentro de Kriuu reunió a builders de distintas universidades y niveles. La comunidad recorrió el stack de herramientas de IA que se usa para crear productos y siguió un proceso de construcción en vivo.',
    accent: 'bg-energy',
  },
  {
    name: 'OpenAI Buildathon',
    city: 'Portoviejo',
    location: 'PUCE Manabí · Portoviejo',
    description:
      'Durante seis horas, los equipos convirtieron ideas en prototipos funcionales con Codex y presentaron sus demos ante un jurado. Kriuu apoyó la organización y la mentoría de los participantes durante el proceso.',
    prizes:
      'Premios: USD 5.000 para el primer lugar, USD 2.500 para el segundo y USD 1.000 para el tercero, en créditos para la API de OpenAI.',
    accent: 'bg-electric',
  },
  {
    name: 'OpenAI Buildathon',
    city: 'Manta',
    location: 'PUCE Manabí · Campus Manta',
    description:
      'Una jornada intensiva de construcción con Codex en la que Kriuu participó con Bowin y alcanzó el tercer lugar del concurso, premiado con USD 1.000 en créditos para la API de OpenAI.',
    prizes:
      'Premios: USD 5.000 para el primer lugar, USD 2.500 para el segundo y USD 1.000 para el tercero, en créditos para la API de OpenAI.',
    highlight:
      'Es un coach escénico impulsado por IA: permite subir o grabar una presentación y entrega feedback sincronizado sobre la voz, el lenguaje corporal, la claridad del discurso y el dominio del tema.',
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
            Encuentros organizados por Kriuu y espacios en los que participamos para reunir a la
            comunidad de tecnología e IA, aprender en conjunto y construir desde Manabí.
          </p>
        </div>

        <div className='mt-10 grid gap-px bg-cream/15 md:grid-cols-2'>
          {EVENTS.map((event, index) => (
            <article
              key={`${event.name}-${event.city}`}
              className='relative min-h-80 overflow-hidden bg-dark p-6 md:p-8'
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${event.accent}`} />
              <p className='text-xs font-medium uppercase tracking-[0.18em] text-cream/45'>
                Evento {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className='mt-10 font-display text-4xl font-semibold leading-none'>{event.name}</h3>
              <p className='mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-cream/60'>
                {event.city} · Ecuador
              </p>
              <p className='mt-2 text-xs font-medium uppercase tracking-[0.14em] text-cream/40'>
                {event.location}
              </p>
              <p className='mt-6 text-sm leading-6 text-cream/68'>{event.description}</p>
              {event.prizes ? (
                <p className='mt-4 text-xs font-medium leading-5 text-cream/50'>{event.prizes}</p>
              ) : null}
              {event.highlight ? (
                <p className='mt-5 border-l-2 border-lime pl-4 text-sm leading-6 text-cream/85'>
                  <strong className='font-semibold text-cream'>Bowin.</strong> {event.highlight}
                </p>
              ) : null}
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
