// TODO: reemplazar con data real de los miembros fundadores
const MEMBERS = [
  {
    name: 'Luis Velasco',
    role: 'Co-founder',
    desc: 'Arrancó Kriuu desde Manabí con la convicción de que el talento no tiene zip code.',
  },
  {
    name: 'María Torres',
    role: 'Software Engineer',
    desc: 'Construye herramientas de código abierto para equipos de Latam.',
  },
  {
    name: 'Carlos Mora',
    role: 'Product Designer',
    desc: 'Diseña sistemas que hacen que lo complejo parezca simple.',
  },
  {
    name: 'Ana Loor',
    role: 'Data Scientist',
    desc: 'Aplica ML a problemas reales del contexto latinoamericano.',
  },
  {
    name: 'Sebastián Rivas',
    role: 'Backend Engineer',
    desc: 'Open source contributor, mentor y fan incondicional de los tests automatizados.',
  },
  {
    name: 'Valeria Cruz',
    role: 'Founder',
    desc: 'Lanzando su segunda startup. La primera falló y aprendió más que en cualquier curso.',
  },
] as const;

export default function Directory() {
  return (
    <section
      id='directory'
      className='border-t border-dark/[0.08] bg-cream py-[120px]'
    >
      <div className='mx-auto max-w-[1280px] px-5 md:px-8'>
        <div className='mx-auto max-w-[760px]'>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/50'>
            Directory
          </p>
          <div className='mt-10 space-y-4 text-[17px] leading-[1.7] text-dark'>
            <p>
              Estas son las personas que están construyendo Kriuu desde el
              inicio, los que llegaron antes de que hubiera razones obvias para
              llegar.
            </p>
          </div>
        </div>

        <div className='mt-16 grid grid-cols-1 gap-px border border-dark/[0.08] bg-dark/[0.08] sm:grid-cols-2 lg:grid-cols-3'>
          {MEMBERS.map(({ name, role, desc }) => (
            <article key={name} className='flex flex-col gap-1.5 bg-cream p-8'>
              <p className='text-[15px] font-semibold text-dark'>{name}</p>
              <p className='text-xs font-medium uppercase tracking-wider text-dark/50'>
                {role}
              </p>
              <p className='mt-2 text-sm leading-relaxed text-dark/60'>
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
