const ITEMS = [
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

export default function ManifiestoSection() {
  return (
    <section id='manifiesto' className='bg-dark py-16 md:py-30'>
      <div className='mx-auto max-w-7xl px-5 md:px-8'>
        <div className='mx-auto max-w-190'>
          <p className='text-xs font-medium uppercase tracking-widest text-cream/40'>
            Manifiesto
          </p>

          <div className='mt-12 space-y-0 divide-y divide-cream/8'>
            {ITEMS.map(({ n, text }) => (
              <div key={n} className='flex gap-6 py-8 md:gap-10 md:py-10'>
                <span className='w-10 shrink-0 font-mono text-[11px] text-cream/30 md:w-12'>
                  [{n}]
                </span>
                <p className='text-[17px] leading-[1.7] text-cream/80'>{text}</p>
              </div>
            ))}
          </div>

          <p className='mt-14 border-t border-cream/8 pt-10 text-2xl font-medium italic leading-snug text-cream md:text-3xl'>
            Kriuu es de quienes la construyen.
          </p>
        </div>
      </div>
    </section>
  );
}
