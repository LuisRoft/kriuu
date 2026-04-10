import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function JoinCta() {
  return (
    <section
      id='join'
      className='relative flex min-h-[600px] items-center justify-center overflow-hidden border-t border-dark/[0.08] py-[120px]'
    >
      <Image
        src='/bgs/bg-cta.png'
        alt=''
        fill
        className='pointer-events-none object-cover brightness-50'
      />

      <div className='relative z-10 mx-auto w-full max-w-[1240px] bg-dark/80 px-8 py-14 text-center backdrop-blur-sm md:px-14 md:py-16'>
        <div className='space-y-5 text-[17px] leading-[1.7] text-cream'>
          <p>
            Kriuu funciona en la medida en que la gente participa, propone y se
            compromete. No somos una plataforma ni un programa. Somos una
            comunidad, lo que significa que es tan buena como las personas que
            la forman.
          </p>
          <p>
            Si construyes algo, si quieres construir algo, o si simplemente
            tienes curiosidad por ver qué están haciendo otros, hay lugar para
            ti aquí.
          </p>
        </div>

        <div className='mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <Button
            className='group h-auto gap-2 px-7 py-3.5 text-sm font-semibold'
            asChild
          >
            <Link href='#'>
              Únete a la kriuu
              <ArrowRight className='size-4 transition-transform duration-200 group-hover/button:translate-x-1' />
            </Link>
          </Button>

        </div>
      </div>
    </section>
  );
}
