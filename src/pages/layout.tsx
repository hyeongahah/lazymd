import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import Head from 'next/head';

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
    <>
      <Head>
        <title>LazyMD - Markdown Editor</title>
        <meta
          name='description'
          content='LazyMD - A simple and elegant markdown editor'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </div>
    </>
  );
}
