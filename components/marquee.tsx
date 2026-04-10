const ITEMS = [
  'Engineers',
  'Designers',
  'Founders',
  'Builders',
  'Desde Latam',
  'kriuu',
];

function MarqueeTrack() {
  const items = [...ITEMS, ...ITEMS];

  return (
    <div className='flex shrink-0 items-center gap-8'>
      {items.map((item, i) => (
        <span key={i} className='flex items-center gap-8'>
          <span className='whitespace-nowrap font-display text-sm font-medium uppercase tracking-widest text-dark/40'>
            {item}
          </span>
          <span className='text-dark/20'>·</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      aria-hidden='true'
      className='flex overflow-hidden border-y border-dark/8 bg-cream py-4'
    >
      <div className='flex animate-marquee items-center'>
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
    </div>
  );
}
