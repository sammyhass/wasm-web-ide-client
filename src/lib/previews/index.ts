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

// Sets up the WebAssembly memory to be used by the WebAssembly code
// If the code is Go, we need to instantiate the Go object, otherwise we can
// just instantiate the WebAssembly memory
const instantiateMemory = (isGo = true) => `
  const memory = ${
    isGo ? `new Go()` : `new WebAssembly.Memory({ initial: 10, maximum: 256 })`
  };
`;

const getAssemblyScriptImports = () => `{
  env: {
    abort: () => console.error('abort'),
    trace: (msg, num) => console.log('trace', msg, num),
    memory,
  },
}
`;

// Sets up WebAssembly to be run in the browser along with any JS code to be
// run after the WebAssembly is loaded
const runWasm = (js?: string, src?: string, isGo = true) =>
  !!src
    ? `

  let wasm = null;

  ${instantiateMemory(isGo)}

  WebAssembly.instantiateStreaming(fetch('${src}'), ${
        isGo ? 'memory.importObject' : getAssemblyScriptImports()
      }).then(___result => {
    wasm = ___result.instance;
    ${isGo ? 'memory.run(wasm);' : ''}
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
        ${runWasm(js, wasmPath, useGo)}
      </script>
    </head>
    <body data-testid="preview-body">
      ${html}
    </body>
  </html>
`;
