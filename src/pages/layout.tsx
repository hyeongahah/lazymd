import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import '@/styles/theme.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
