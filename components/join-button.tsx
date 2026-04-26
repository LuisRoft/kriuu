'use client';

import { type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJoinForm } from '@/components/join-provider';

type JoinButtonProps = {
  children?: ReactNode;
  className?: string;
  iconClassName?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export default function JoinButton({
  children = 'Únete a la kriuu',
  className,
  iconClassName = 'size-4',
  size,
}: JoinButtonProps) {
  const { openJoinForm } = useJoinForm();

  return (
    <Button
      type='button'
      onClick={openJoinForm}
      className={`group/button h-auto gap-2 font-semibold ${className ?? ''}`}
      size={size}
    >
      {children}
      <ArrowRight
        className={`${iconClassName} transition-transform duration-200 group-hover/button:translate-x-1`}
      />
    </Button>
  );
}
