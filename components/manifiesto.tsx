const PILARES = [
  {
    num: '01',
    tag: 'Open Source',
    title: 'Código abierto por defecto.',
    desc: 'Creemos que el conocimiento no debe tener fronteras. Si lo construimos, lo compartimos.',
  },
  {
    num: '02',
    tag: 'Collaboration',
    title: 'Radical Co-creation.',
    desc: 'Nadie construye solo. Los problemas complejos requieren mentes diversas trabajando en sincronía.',
  },
  {
    num: '03',
    tag: 'Excellence',
    title: 'Technical Rigor.',
    desc: 'No solo lanzamos productos; esculpimos piezas de ingeniería que resisten la prueba del tiempo.',
  },
  {
    num: '04',
    tag: 'Impact',
    title: 'Global Reach.',
    desc: 'Nacidos en LATAM, construyendo para el mundo. La geografía ya no es un límite para la ambición.',
  },
] as const;

export default function Manifiesto() {
  return (
    <section
      id='manifiesto'
      className='px-5 py-20 md:px-12 md:py-32 lg:px-48 bg-white'
    >
      <div className='flex flex-col gap-16 lg:flex-row lg:gap-24'>
        <div className='lg:w-1/3'>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/50'>
            01 / Manifesto
          </p>
          <h2 className='mt-4 max-w-sm font-display text-4xl font-semibold leading-tight tracking-tight text-dark md:text-5xl'>
            Nuestra filosofía de laboratorio.
          </h2>
        </div>

        <div className='grid grid-cols-1  border border-olive/15 sm:grid-cols-2 lg:flex-1'>
          {PILARES.map(({ num, tag, title, desc }) => (
            <article
              key={num}
              className='flex flex-col gap-3 border border-olive/15 p-6 md:p-8'
            >
              <p className='text-xs font-medium uppercase tracking-widest text-dark/40'>
                {num}. {tag}
              </p>
              <h3 className='font-display text-xl font-bold text-dark md:text-2xl'>
                {title}
              </h3>
              <p className='text-sm leading-relaxed text-dark/60 md:text-base'>
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
