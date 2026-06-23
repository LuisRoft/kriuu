const TOPICS = [
  'Comunidades tech',
  'Inteligencia artificial',
  'Ética tecnológica',
  'Desarrollo de software',
  'Diseño de producto',
  'Emprendimiento en Latam',
  'Tecnología para salud',
  'Educación y tecnología',
  'Derecho y tecnología',
];

export default function SeoTopics() {
  return (
    <section className='border-t border-dark/10 bg-cream px-5 py-16 md:px-8 md:py-20'>
      <div className='mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start'>
        <div>
          <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>Temas</p>
          <h2 className='mt-4 max-w-2xl font-display text-4xl font-semibold leading-none tracking-tight text-dark md:text-6xl'>
            Tecnología con criterio comunitario.
          </h2>
        </div>
        <div>
          <p className='text-base leading-8 text-dark/68'>
            Kriuu reúne personas interesadas en tecnología, inteligencia artificial, ética tecnológica,
            desarrollo de software, diseño, investigación y emprendimiento. Conversamos, publicamos y
            construimos desde Manabí para conectar talento de Ecuador y Latam. Queremos construir la
            mejor comunidad de tecnología del Ecuador: una red abierta, diversa y práctica para aprender,
            crear y usar la tecnología con criterio.
          </p>
          <p className='mt-5 text-base leading-8 text-dark/68'>
            No es una comunidad solo para ingenieros. Creemos que la tecnología es para médicos,
            diseñadores, programadores, abogados, psicólogos, docentes, investigadores, artistas,
            emprendedores y para cualquier persona que la usa para mejorar su trabajo, su entorno y
            la forma en que aprende. Queremos representar a quienes ya conviven con la tecnología y
            enseñar cómo puede convertirse en una herramienta más humana, útil y responsable.
          </p>
          <div className='mt-6 flex flex-wrap gap-2'>
            {TOPICS.map((topic) => (
              <span
                key={topic}
                className='inline-flex min-h-9 items-center border border-dark/12 bg-white/25 px-3 text-sm font-semibold text-dark/68'
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
