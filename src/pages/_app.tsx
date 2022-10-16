// src/pages/_app.tsx
import Navbar from '@/components/Navbar';
import { queryClient } from '@/lib/api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppType } from 'next/app';
import dynamic from 'next/dynamic';
import '../styles/globals.css';

const WasmTinyScript = dynamic(() => import('@/lib/wasm/WasmTinyScript'), {
  ssr: false,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
