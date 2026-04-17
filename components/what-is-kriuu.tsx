import Image from 'next/image';

export default function QueEsKriuu() {
  return (
    <section
      id='que-es'
      className='border-t border-dark/8 bg-cream py-16 md:py-30'
    >
      <div className='mx-auto max-w-7xl px-5 md:px-8'>
        <div className='flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20'>
          {/* Texto */}
          <div className='flex-1 lg:max-w-130'>
            <p className='text-xs font-medium uppercase tracking-widest text-dark/50'>
              ¿Qué es Kriuu?
            </p>
            <div className='mt-12 space-y-6 text-[17px] leading-[1.7] text-dark'>
              <p>
                Kriuu es una comunidad para los que construyen cosas. Software,
                proyectos, ideas que eventualmente se vuelven algo real.
              </p>
              <p>
                Nació en Ecuador porque había talento sin un lugar donde
                juntarse. No un evento de una noche. No algo temporal. Una
                comunidad de verdad, para engineers, designers, founders y todo
                aquel que tenga algo que construir o quiera aprender cómo.
              </p>
              <p>
                Más que enfocarnos en una herramienta o lenguaje, nos interesa
                la mentalidad: entender el problema, explorar soluciones,
                iterar, aprender en el camino. Eso es lo que llamamos ser un
                builder.
              </p>
            </div>
          </div>

          {/* Foto del equipo */}
          <div className='group relative w-full shrink-0 overflow-hidden lg:w-105 xl:w-120'>
            <div className='relative aspect-3/4 min-h-85 overflow-hidden lg:aspect-auto lg:h-full lg:min-h-115'>
              <Image
                src='/moments/kriuu-6.jpeg'
                alt='El equipo de Kriuu'
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-[1.02]'
                sizes='(max-width: 1024px) 100vw, 480px'
              />
            </div>

            <div className='border-t border-dark/8 px-4 py-3'>
              <p className='text-[10px] font-medium uppercase tracking-widest text-dark/40'>
                El equipo · Kriuu
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
