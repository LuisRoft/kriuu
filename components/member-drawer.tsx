'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import MemberPhoto from './member-photo';
import type { Member } from '@/lib/members';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';

interface Props {
  member: Member | null;
  onClose: () => void;
  direction?: 'bottom' | 'right';
}

export default function MemberDrawer({
  member,
  onClose,
  direction = 'bottom',
}: Props) {
  return (
    <Drawer
      open={!!member}
      onOpenChange={(open) => !open && onClose()}
      direction={direction}
    >
      <DrawerContent className='border-dark/12 bg-cream outline-none z-1000'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-dark/8 px-5 py-3'>
          <span className='text-xs font-medium uppercase tracking-widest text-dark/40'>
            Miembro
          </span>
          <DrawerClose className='flex size-9 items-center justify-center border border-dark/12 text-dark/50 transition-colors hover:text-dark'>
            <X className='size-3.5' />
            <span className='sr-only'>Cerrar</span>
          </DrawerClose>
        </div>

        {/* Scrollable body */}
        <div className='overflow-y-auto'>
          {member && (
            <>
              {/* Photo */}
              <MemberPhoto
                src={member.photo}
                name={member.name}
                className='aspect-square w-full border-b border-dark/8'
              />

              {/* Info */}
              <div className='p-5'>
                <DrawerTitle className='font-display text-xl font-semibold text-dark'>
                  {member.name}
                </DrawerTitle>

                {member.role && (
                  <p className='mt-1.5 text-[11px] font-medium uppercase tracking-widest text-dark/50'>
                    {member.role}
                  </p>
                )}

                {member.desc && (
                  <>
                    <div className='mt-5 border-t border-dark/8' />
                    <DrawerDescription className='mt-5 text-sm leading-relaxed text-dark/60'>
                      {member.desc}
                    </DrawerDescription>
                  </>
                )}

                {member.linkedin && (
                  <div className='mt-6'>
                    <Link
                      href={member.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex h-10 items-center border border-dark/12 px-4 text-[11px] font-medium text-dark/50 transition-colors hover:border-dark/30 hover:text-dark'
                    >
                      LinkedIn ↗
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
