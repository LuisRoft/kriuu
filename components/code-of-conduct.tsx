'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  CODE_OF_CONDUCT_DATE,
  CODE_OF_CONDUCT_PREVIEW_ITEMS,
  CODE_OF_CONDUCT_SECTIONS,
} from '@/lib/code-of-conduct';

export default function CodeOfConductSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section id='codigo-de-conducta' className='border-t border-dark/8 bg-cream py-16 md:py-30'>
        <div className='mx-auto max-w-7xl px-5 md:px-8'>
          <div className='mx-auto max-w-190'>
            <p className='text-xs font-medium uppercase tracking-widest text-dark/50'>
              Código de conducta
            </p>

            <div className='mt-12 space-y-0 divide-y divide-dark/8'>
              {CODE_OF_CONDUCT_PREVIEW_ITEMS.map(({ n, text }) => (
                <div key={n} className='flex gap-6 py-8 md:gap-10 md:py-10'>
                  <span className='w-10 shrink-0 font-mono text-[11px] text-dark/30 md:w-12'>
                    [{n}]
                  </span>
                  <p className='text-[17px] leading-[1.7] text-dark/78'>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className='mt-14 flex flex-col gap-6 border-t border-dark/8 pt-10 md:flex-row md:items-end md:justify-between'>
              <p className='max-w-3xl text-2xl font-medium italic leading-snug text-dark md:text-3xl'>
                Una comunidad abierta necesita acuerdos claros.
              </p>

              <Button
                type='button'
                onClick={() => setIsOpen(true)}
                className='group/button h-auto self-start gap-2 px-5 py-3 text-sm font-semibold md:px-7 md:py-3.5'
                size='lg'
              >
                Leer código completo
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
          <div className='flex items-center justify-between border-b border-cream/8 px-4 py-4 md:px-8 md:py-5'>
            <DrawerClose className='inline-flex min-h-11 items-center gap-3 border border-cream/12 px-4 text-sm font-medium text-cream/88 transition-colors hover:border-cream/25 hover:text-cream'>
              <ArrowLeft className='size-4' />
              <span>Volver</span>
            </DrawerClose>

            <div className='text-right'>
              <p className='text-[10px] font-medium uppercase tracking-[0.28em] text-cream/38'>
                Acuerdo comunitario
              </p>
              <p className='mt-1 text-xs text-cream/55'>{CODE_OF_CONDUCT_DATE}</p>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
            <div className='mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12'>
              <div className='max-w-4xl'>
                <p className='text-xs font-medium uppercase tracking-widest text-cream/40'>
                  Kriuu
                </p>
                <DrawerTitle className='mt-4 text-4xl font-medium leading-none tracking-tight text-cream sm:text-5xl md:text-6xl'>
                  Cómo nos tratamos.
                </DrawerTitle>
                <p className='mt-8 max-w-3xl text-base leading-[1.9] text-cream/78 md:text-lg'>
                  Este código define el ambiente que queremos construir y mantener
                  en Kriuu. Al participar en la comunidad, cada persona acepta
                  cuidar estos acuerdos en los espacios presenciales y digitales.
                </p>
              </div>

              <div className='mt-12 space-y-10 md:mt-16 md:space-y-14'>
                {CODE_OF_CONDUCT_SECTIONS.map((section) => {
                  const quote = 'quote' in section ? section.quote : null;

                  return (
                    <section
                      key={section.id}
                      className='grid gap-5 border-t border-cream/8 pt-8 md:grid-cols-[84px_minmax(0,1fr)] md:gap-8 md:pt-10'
                    >
                      <div className='flex items-center gap-3 md:block'>
                        <span className='font-mono text-[11px] text-cream/35'>
                          [{section.id}]
                        </span>
                        <h3 className='text-lg font-medium text-cream md:mt-3 md:text-xl'>
                          {section.title}
                        </h3>
                      </div>

                      <div className='space-y-5 text-[15px] leading-[1.9] text-cream/76 md:text-[17px]'>
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        {quote ? (
                          <p className='border-l border-l-lime/60 pl-4 text-lg italic text-cream md:pl-6 md:text-xl'>
                            &ldquo;{quote}&rdquo;
                          </p>
                        ) : null}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
