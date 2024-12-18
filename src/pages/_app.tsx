import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/hooks/useTheme';
import 'katex/dist/katex.min.css';
import '../styles/globals.css';
import '@/styles/theme.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
