// src/pages/_app.tsx
import Navbar from '@/components/Navbar';
import { queryClient } from '@/lib/api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppType } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>WASM IDE</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
