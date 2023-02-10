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
  console.error(e.message)
}
`;

// Sets up WebAssembly to be run in the browser along with any JS code to be
// run after the WebAssembly is loaded
const runGoWasmCode = (js?: string, src?: string, isGo = true) =>
  !!src
    ? `
  var go = new Go();


  let wasm = null;

  WebAssembly.instantiateStreaming(fetch('${src}'), go.importObject).then(___result => {
    wasm = ___result.instance;
    ${isGo ? 'go.run(wasm);' : ''}
    ${runJS(js || '')}
  }).catch(e => {
    console.error(e)
  });
`
    : `
    console.warn('Running JS only. Try recompiling your code to include WebAssembly.')
    ${runJS(js || '')}
    `;

export const iframeContent = ({
  html,
  css,
  js,
  wasmPath,
  nonce,
  useGo = true,
}: {
  html: string;
  css?: string;
  js?: string;
  wasmPath?: string;
  useGo?: boolean;
  nonce?: string;
}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style data-testid="preview-css">
        ${css}
      </style>
      ${useGo ? `<script src="/wasm_exec_tiny.js"></script>` : ``}

      <script type="module" defer data-testid="preview-script">
        (() => {
          const __nonce = '${nonce}';
        })()
        ${consoleReassign}
        ${runGoWasmCode(js, wasmPath, useGo)}
      </script>
    </head>
    <body data-testid="preview-body">
      ${html}
    </body>
  </html>
`;
