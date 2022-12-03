import { useWasmReady } from '@/hooks/useWasmReady';

export const runWASM = async (src: string) => {
  if (!useWasmReady.getState().isReady) {
    console.warn('wasm_exec_tiny.js has not been loaded yet');
    return;
  }
  const go = new Go();
  console.log('Running WASM', src);
  WebAssembly.instantiateStreaming(fetch(src), go.importObject).then(result => {
    go.run(result.instance);
  });
};

export const runWasmCode = (src?: string) =>
  src
    ? `
  const go = new Go();

  WebAssembly.instantiateStreaming(fetch('${src}'), go.importObject).then(result => {
    go.run(result.instance);
  });
`
    : '';
