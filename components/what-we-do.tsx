import Image from 'next/image';

export default function LoQueHacemos() {
  return (
    <section
      id='lo-que-hacemos'
      className='border-t border-dark/8 bg-cream py-16 md:py-30'
    >
      <div className='mx-auto max-w-7xl px-5 md:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-16'>
          {/* Texto */}
          <div className='flex flex-1 flex-col justify-center lg:max-w-130'>
            <p className='text-xs font-medium uppercase tracking-widest text-dark/50'>
              Lo que hacemos
            </p>
            <div className='mt-12 space-y-8 text-[17px] leading-[1.7] text-dark'>
              {/* Actividades */}
              <ul className='space-y-3'>
                {[
                  ['Talleres', 'donde se aprende haciendo, no escuchando.'],
                  [
                    'Hackathones',
                    'donde importa el proceso tanto como el resultado.',
                  ],
                  [
                    'Charlas',
                    'donde se muestra el trabajo aunque no funcione del todo.',
                  ],
                ].map(([name, desc]) => (
                  <li key={name} className='flex gap-3'>
                    <span className='shrink-0 font-mono text-[11px] text-dark/30 mt-1.25'>
                      [*]
                    </span>
                    <span>
                      <span className='font-medium'>{name}</span> —{' '}
                      <span className='text-dark/60'>{desc}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className='text-dark/70'>
                Compartir lo que está en construcción tiene tanto valor como
                mostrar lo que ya está terminado. No hace falta tener todo
                resuelto o aprendido para participar.
              </p>

              <p className='text-dark/70'>
                Cualquier carrera, cualquier nivel. Las comunidades más
                interesantes mezclan perspectivas.
              </p>
            </div>
          </div>

          {/* Foto dominante */}
          <div className='group relative w-full shrink-0 overflow-hidden lg:w-105 xl:w-120'>
            <div className='relative aspect-3/4 min-h-85 overflow-hidden lg:aspect-auto lg:h-full lg:min-h-115'>
              <Image
                src='/moments/kriuu-7.png'
                alt='Lo que hacemos en Kriuu'
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-[1.02]'
                sizes='(max-width: 1024px) 100vw, 480px'
              />
            </div>

            <div className='border-t border-dark/8 px-4 py-3'>
              <p className='text-[10px] font-medium uppercase tracking-widest text-dark/40'>
                Comunidad · Kriuu
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
