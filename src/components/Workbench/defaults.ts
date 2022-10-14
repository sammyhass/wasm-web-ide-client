export const iframeContent = ({
  html,
  css,
  js,
}: {
  html: string;
  css?: string;
  js?: string;
}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${css}
      </style>
    
    </head>
    <body>
      ${html}
      <script>
        ${js}
      </script>
      </body>
  </html>
`;

export const INITIAL_HTML = `<h1>Hello Web Assembly!</h1>`;

export const INITAL_JS = `console.log('Hello from JS!')`;

export const INITIAL_GO = `package main

import "syscall/js"

func main() {
  js.Global().Get("alert").Invoke("Hello WASM!")
}`;

export const DEFAULT_FILES = {
  go: {
    name: 'main.go',
    language: 'go',
    value: INITIAL_GO,
    type: 'file',
  },
  js: {
    name: 'app.js',
    language: 'javascript',
    value: INITAL_JS,
    type: 'file',
  },
  html: {
    name: 'index.html',
    language: 'html',
    value: INITIAL_HTML,
    type: 'file',
  },
};
