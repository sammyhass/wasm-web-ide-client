// src/pages/_app.tsx
import Navbar from '@/components/Navbar';
import { queryClient } from '@/lib/api/queryClient';
import WasmTinyScript from '@/lib/wasm/WasmTinyScript';
import type { AppType } from 'next/app';
import { QueryClientProvider } from 'react-query';
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
