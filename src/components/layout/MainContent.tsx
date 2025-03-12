"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  return (
    <main className={isHomePage ? 'pt-0' : 'pt-16'}>
      {children}
    </main>
  );
};
