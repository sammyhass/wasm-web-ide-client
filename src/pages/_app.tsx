// src/pages/_app.tsx
import DefaultLayout from '@/layouts/DefaultLayout';
import { queryClient } from '@/lib/api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { NextPage } from 'next';
import type { AppProps, AppType } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Fonts
import '@fontsource/fira-code/400.css';
import '@fontsource/fira-code/700.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';

import { ToastProvider } from '@/components/Toast';
import '../styles/globals.css';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || DefaultLayout;

  return (
    <>
      <Head>
        <title>WASM IDE</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        {getLayout(<Component {...pageProps} />)}
        <ToastProvider />

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
