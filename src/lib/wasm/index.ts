// Sets up WebAssembly to be run in the browser along with any JS code to be
// run after the WebAssembly is loaded
export const runWasmCode = (js?: string, src?: string) =>
  src
    ? `
  var go = new Go();

  let wasm;

  WebAssembly.instantiateStreaming(fetch('${src}'), go.importObject).then(result => {
    wasm = result.instance;
    go.run(wasm);
    ${js}
  });
`
    : js ?? '';
