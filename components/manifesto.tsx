'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const PREVIEW_ITEMS = [
  {
    n: '01',
    text: 'El trabajo que se comparte vale más que el que se guarda.',
  },
  {
    n: '02',
    text: 'No hace falta tener todo resuelto para mostrarlo. De hecho, preferimos que no lo tengas.',
  },
  {
    n: '03',
    text: 'Construir en público no es vulnerabilidad. Es la forma más rápida de mejorar.',
  },
  {
    n: '04',
    text: 'No esperamos que nadie nos ponga en el mapa. Lo estamos construyendo nosotros.',
  },
];

const MANIFESTO_SECTIONS = [
  {
    id: 'I',
    title: 'El contexto',
    paragraphs: [
      'En Ecuador, la mayoría de los eventos de tecnología, los hackathones, las conferencias y los encuentros de comunidad suceden en Quito o Guayaquil. Eso no es una crítica, tiene sentido que las cosas ocurran donde hay más masa crítica. Pero también significa que mucha gente queda afuera, no por falta de interés ni de capacidad, sino simplemente por distancia.',
      'Queremos aprovechar el talento y la capacidad que existe para unificarlo, asentando bases para que Manabí pueda ser reconocido como un punto importante para la tecnología, y para que más personas, incluso de otras ciudades, provincias o países, se interesen por participar en nuestras actividades.',
      'Manabí tiene universidades, tiene estudiantes, tiene profesionales que trabajan con tecnología todos los días. Lo que no tiene, o no tenía, es un espacio propio donde esas personas se encuentren, compartan lo que están haciendo y aprendan juntas. Kriuu quiere ser ese espacio.',
    ],
  },
  {
    id: 'II',
    title: 'Quiénes somos',
    paragraphs: [
      'Somos una comunidad orientada a la creación. Al proceso de construir cosas: software, sistemas, proyectos, ideas que eventualmente se vuelven algo concreto.',
      'Nos interesa el enfoque STEAM, ciencia, tecnología, ingeniería, arte y matemáticas, porque creemos que hoy casi todas las disciplinas se cruzan con la tecnología de alguna forma. El médico que trabaja con datos, el comunicador que automatiza tareas, el artista que experimenta con herramientas digitales, el ingeniero que aprende a programar. La tecnología ya no es solo para quienes estudian sistemas.',
      'Más que enfocarnos en una sola herramienta o lenguaje, nos interesa la mentalidad de quien construye y para qué construye: entender el problema, explorar soluciones, iterar, aprender en el camino. Eso es lo que llamamos ser un constructor.',
    ],
  },
  {
    id: 'III',
    title: 'Cómo queremos funcionar',
    paragraphs: [
      'Queremos hacer talleres prácticos, hackathones, charlas y juntadas donde la gente pueda mostrar en qué está trabajando, aunque esté incompleto, aunque todavía no funcione bien. Creemos que compartir el proceso tiene tanto valor como mostrar el resultado final.',
      'Queremos construir relaciones con universidades y con organizaciones fuera de ellas. Colaborar con empresas de tecnología u otras comunidades. Queremos que haya personas de distintas carreras y niveles de experiencia, porque las comunidades más interesantes son las que mezclan perspectivas.',
      'No somos una empresa ni un programa formal. Somos una comunidad, lo que significa que funciona en la medida en que la gente participa, propone y se compromete. Kriuu es de quienes la construyen.',
    ],
  },
  {
    id: 'IV',
    title: 'Lo que esperamos',
    paragraphs: [
      'A mediano plazo, queremos que Manabí tenga una comunidad tech activa y visible. Que los eventos no sean algo a lo que hay que viajar, sino algo que ocurre aquí. Que alguien que empieza a aprender programación, o diseño, o análisis de datos, encuentre personas con quienes crecer.',
      'No tenemos prisa por ser grandes. Tenemos más interés en ser útiles, en que cada persona que pase por Kriuu encuentre algo que le sirva: una conexión, un aprendizaje, un proyecto en el que colaborar.',
    ],
    quote:
      'Manabí tiene el talento. Kriuu quiere ser el lugar donde se encuentre.',
  },
  {
    id: 'V',
    title: 'A quién va dirigido esto',
    paragraphs: [
      'A cualquier persona que tenga curiosidad por la tecnología, la creación o el proceso de construir cosas, sin importar de dónde sea o qué estudie. A estudiantes y a profesionales. A los que llevan años en esto y a los que están empezando.',
      'A los que tienen un proyecto en mente y no saben por dónde empezar, y a los que ya tienen algo funcionando y quieren mostrárselo a alguien. Si te interesa aprender, compartir o simplemente ver qué están haciendo otros, hay lugar para ti aquí.',
    ],
  },
];

export default function ManifiestoSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section id='manifiesto' className='bg-dark py-16 md:py-30'>
        <div className='mx-auto max-w-7xl px-5 md:px-8'>
          <div className='mx-auto max-w-190'>
            <p className='text-xs font-medium uppercase tracking-widest text-cream/40'>
              Manifiesto
            </p>

            <div className='mt-12 space-y-0 divide-y divide-cream/8'>
              {PREVIEW_ITEMS.map(({ n, text }) => (
                <div key={n} className='flex gap-6 py-8 md:gap-10 md:py-10'>
                  <span className='w-10 shrink-0 font-mono text-[11px] text-cream/30 md:w-12'>
                    [{n}]
                  </span>
                  <p className='text-[17px] leading-[1.7] text-cream/80'>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className='mt-14 flex flex-col gap-6 border-t border-cream/8 pt-10 md:flex-row md:items-end md:justify-between'>
              <p className='max-w-3xl text-2xl font-medium italic leading-snug text-cream md:text-3xl'>
                Kriuu es de quienes la construyen.
              </p>

              <Button
                type='button'
                onClick={() => setIsOpen(true)}
                className='group/button h-auto self-start gap-2 px-5 py-3 text-sm font-semibold md:px-7 md:py-3.5'
                size='lg'
              >
                Leer manifiesto completo
                <ArrowRight className='size-4 transition-transform duration-200 group-hover/button:translate-x-1' />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Drawer open={isOpen} onOpenChange={setIsOpen} direction='right'>
        <DrawerContent
          overlayClassName='bg-dark/45 backdrop-blur-[2px]'
          className='z-1000 flex h-full flex-col border-cream/10 bg-dark text-cream
                     data-[vaul-drawer-direction=right]:w-full
                     data-[vaul-drawer-direction=right]:sm:max-w-[82vw]
                     data-[vaul-drawer-direction=right]:xl:max-w-[50vw]'
        >
          {/* Header */}
          <div className='flex items-center justify-between border-b border-cream/8 px-4 py-4 md:px-8 md:py-5'>
            <DrawerClose className='inline-flex min-h-11 items-center gap-3 border border-cream/12 px-4 text-sm font-medium text-cream/88 transition-colors hover:border-cream/25 hover:text-cream'>
              <ArrowLeft className='size-4' />
              <span>Volver</span>
            </DrawerClose>

            <div className='text-right'>
              <p className='text-[10px] font-medium uppercase tracking-[0.28em] text-cream/38'>
                Manifiesto fundacional
              </p>
              <p className='mt-1 text-xs text-cream/55'>
                Manabí, Ecuador · 6 de marzo de 2026
              </p>
            </div>
          </div>

          {/* Scrollable content */}
          <div className='flex-1 overflow-y-auto'>
            <div className='mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12'>
              <div className='max-w-4xl'>
                <p className='text-xs font-medium uppercase tracking-widest text-cream/40'>
                  Kriuu
                </p>
                <DrawerTitle className='mt-4 text-4xl font-medium leading-none tracking-tight text-cream sm:text-5xl md:text-6xl'>
                  Una comunidad para construir.
                </DrawerTitle>
                <p className='mt-8 max-w-3xl text-base leading-[1.9] text-cream/78 md:text-lg'>
                  Kriuu nació en búsqueda de llenar un vacío en nuestra
                  provincia, un lugar para aprender, compartir y convivir. Nace
                  en Manabí por miembros que trabajan con tecnología, que
                  estudian, que experimentan, y que en algún momento se dieron
                  cuenta de que no había un lugar donde juntarse con otros que
                  estuvieran haciendo lo mismo. No un evento de una noche o de
                  una semana. Una comunidad.
                </p>
              </div>

              <div className='mt-12 space-y-10 md:mt-16 md:space-y-14'>
                {MANIFESTO_SECTIONS.map(({ id, title, paragraphs, quote }) => (
                  <section
                    key={id}
                    className='grid gap-5 border-t border-cream/8 pt-8 md:grid-cols-[84px_minmax(0,1fr)] md:gap-8 md:pt-10'
                  >
                    <div className='flex items-center gap-3 md:block'>
                      <span className='font-mono text-[11px] text-cream/35'>
                        [{id}]
                      </span>
                      <h3 className='text-lg font-medium text-cream md:mt-3 md:text-xl'>
                        {title}
                      </h3>
                    </div>

                    <div className='space-y-5 text-[15px] leading-[1.9] text-cream/76 md:text-[17px]'>
                      {paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {quote ? (
                        <p className='border-l border-l-lime/60 pl-4 text-lg italic text-cream md:pl-6 md:text-xl'>
                          &ldquo;{quote}&rdquo;
                        </p>
                      ) : null}
                    </div>
                  </section>
                ))}
              </div>

              <div className='mt-12 border-t border-cream/8 pt-8 md:mt-16 md:pt-10'>
                <p className='text-2xl font-medium italic leading-snug text-cream md:text-3xl'>
                  Diseña, desarrolla e implementa.
                </p>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
