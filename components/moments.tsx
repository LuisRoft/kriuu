import Image from 'next/image';

type Moment = {
  src?: string;
  caption: string;
  author: string;
};

export const MOMENTS: Moment[] = [
  {
    src: '/moments/kriuu-2.jpeg',
    caption: 'Hackathon Nacional · 3er lugar',
    author: 'Luis, Johannes, Byron & Stiven',
  },
  {
    src: '/moments/kriuu-3.jpeg',
    caption: 'Hult Prize',
    author: 'Johannes Carofilis',
  },
  {
    src: '/moments/kriuu-4.jpeg',
    caption: 'Charla · Ciencia de Datos',
    author: 'Johannes & Byron · PUCE Manabí',
  },
  {
    src: '/moments/kriuu-5.jpg',
    caption: 'Hackathon Nacional · 2do lugar',
    author: 'Luis Velasco',
  },
];

export default function Moments() {
  return (
    <section className='border-t border-dark/8 bg-cream'>
      {/* Header */}
      <div className='mx-auto max-w-7xl px-5 py-10 md:px-8'>
        <p className='text-xs font-medium uppercase tracking-widest text-dark/50'>
          De dónde venimos
        </p>
        <p className='mt-3 max-w-lg text-[15px] leading-relaxed text-dark/60'>
          Kriuu no nació de la nada. La forman personas que ya estaban
          participando, construyendo y aprendiendo.
        </p>
      </div>

      {/* Tira de fotos — full bleed */}
      <div className='flex overflow-x-auto scrollbar-none md:grid md:grid-cols-4'>
        {MOMENTS.map((moment, i) => (
          <div
            key={i}
            className='group relative min-w-[72vw] shrink-0 md:min-w-0'
          >
            {/* Foto */}
            <div className='relative aspect-3/4 overflow-hidden bg-dark/[0.07]'>
              {moment.src ? (
                <Image
                  src={moment.src}
                  alt={moment.caption}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                  sizes='(max-width: 768px) 72vw, 20vw'
                />
              ) : (
                <div
                  className='absolute inset-0'
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(51,51,51,0.025) 12px, rgba(51,51,51,0.025) 13px)',
                  }}
                />
              )}

              {/* Overlay degradado en hover */}
              <div className='absolute inset-0 bg-dark/0 transition-colors duration-300 group-hover:bg-dark/10' />
            </div>

            {/* Caption */}
            <div className='border-r border-dark/8 px-3 py-3 last:border-r-0'>
              <p className='text-[11px] font-medium text-dark/80'>
                {moment.author}
              </p>
              <p className='text-[10px] text-dark/40'>{moment.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
