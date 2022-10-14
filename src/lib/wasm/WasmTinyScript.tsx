import { useWasmReady } from '@/hooks/useWasmReady';
import Script from 'next/script';

export default function WasmTinyScript() {
  const ready = useWasmReady(s => s.ready);

  return (
    <Script src="/wasm_exec_tiny.js" strategy="lazyOnload" onLoad={ready} />
  );
}
