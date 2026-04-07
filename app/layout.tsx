import type { Metadata } from 'next';
import { Geist, Space_Grotesk, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-display',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'kriuu.',
  description: 'Comunidad para shipear, buildear y lanzar juntos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' className={cn('scroll-smooth font-sans', spaceGrotesk.variable)}>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
