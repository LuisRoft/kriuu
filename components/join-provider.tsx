'use client';

import dynamic from 'next/dynamic';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const JoinFormDrawer = dynamic(
  () => import('./join-form-drawer').then((module) => module.JoinFormDrawer),
  { ssr: false },
);

type JoinContextValue = {
  openJoinForm: () => void;
};

const JoinContext = createContext<JoinContextValue | null>(null);

export function useJoinForm() {
  const context = useContext(JoinContext);

  if (!context) {
    throw new Error('useJoinForm debe usarse dentro de JoinProvider');
  }

  return context;
}

export default function JoinProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);

  const openJoinForm = useCallback(() => {
    setDrawerMounted(true);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('join') === '1') {
      window.setTimeout(openJoinForm, 0);
    }
  }, [openJoinForm]);

  const value = useMemo(() => ({ openJoinForm }), [openJoinForm]);

  return (
    <JoinContext.Provider value={value}>
      {children}
      {drawerMounted ? (
        <JoinFormDrawer open={isOpen} onOpenChange={setIsOpen} />
      ) : null}
    </JoinContext.Provider>
  );
}
