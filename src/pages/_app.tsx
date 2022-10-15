// src/pages/_app.tsx
import Navbar from '@/components/Navbar';
import { queryClient } from '@/lib/api/queryClient';
import WasmTinyScript from '@/lib/wasm/WasmTinyScript';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppType } from 'next/app';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Component {...pageProps} />
      </QueryClientProvider>
      <WasmTinyScript />
    </>
  );
};

export default MyApp;
