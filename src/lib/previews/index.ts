const consoleReassign = `
const postMessageToParent = (type, data) => {
  window.parent.postMessage({ type, data }, '*');
};

${['log', 'error', 'warn', 'info', 'debug']
  .map(
    method => `
      console.${method} = (...args) => {
        postMessageToParent('console', ['${method}', '[JS]', args]);
      };
    `
  )
  .join('')}
`;

const runJS = (js: string) => `
try {
  ${js}
} catch (e) {
  console.error(e);
}
`;

// Sets up WebAssembly to be run in the browser along with any JS code to be
// run after the WebAssembly is loaded
const runWasmCode = (js?: string, src?: string) =>
  !!src
    ? `
  var go = new Go();

  let wasm = null;

  WebAssembly.instantiateStreaming(fetch('${src}'), go.importObject).then(___result => {
    wasm = ___result.instance;
    go.run(wasm);
    ${runJS(js || '')}
  }).catch(e => {
    console.error("Failed to load WebAssembly file for project. Try recompiling your project.");
  });
`
    : `
    console.warn('No WebAssembly file found. Running JS only.');
    ${runJS(js || '')}
    `;

export const iframeContent = ({
  html,
  css,
  js,
  wasmPath,
}: {
  html: string;
  css?: string;
  js?: string;
  wasmPath?: string;
}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${css}
      </style>
      <script src="/wasm_exec_tiny.js"></script>
      <script type="module" defer>
        ${consoleReassign}
        ${runWasmCode(js, wasmPath)}
      </script>
    </head>
    <body>
      ${html}
    </body>
  </html>
`;
