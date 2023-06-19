import { consoleReassign } from "../../previews";

export const packageJson = {
  name: "wasm-ide-assemblyscript-playground",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
    "build-assemblyscript": "asc --config asconfig.json",
  },
  devDependencies: {
    vite: "^4.1.0",
    assemblyscript: "latest",
  },
};

const errorHandler = `window.onerror = (message, source, lineno, colno, error) => {
    console.error(error);
}`;

export const indexAssemblyScript = `
export function fib(n: i32): i32 {
  if (n <= 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
`;

export const publicIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Window</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="/lib/setup-preview.js"></script>
  <script type="module" src="/main.js" defer></script>
</head>
<body>
  <div id="app">
    <h1>Hello World!</h1>
  </div>
</body>
</html>
`;

export const defaultAsConfig = {
  entries: ["assemblyscript/index.ts"],
  options: {
    runtime: "stub",
    bindings: "esm",
    textFile: "out/module.wat",
    outFile: "out/module.wasm",
  },
};
export const mainJs = `
import { fib } from './out/module.js';

const root = document.getElementById('app');

const output = document.createElement('ul');

for (let i = 0; i < 10; i++) {
  const li = document.createElement('li');
  li.textContent = \`fib(\${i}) = \${fib(i)}\`;
  output.appendChild(li);
}

root.appendChild(output);

console.log('Hello from main.js');
`;

export const filesystem = {
  "index.html": {
    file: {
      contents: publicIndexHtml,
    },
  },
  "main.js": {
    file: {
      contents: mainJs,
    },
  },
  "package.json": {
    file: {
      contents: JSON.stringify(packageJson, null, 2),
    },
  },
  "styles.css": {
    file: {
      contents: "html { font-family: sans-serif; }",
    },
  },
  "asconfig.json": {
    file: {
      contents: JSON.stringify(defaultAsConfig, null, 2),
    },
  },

  assemblyscript: {
    directory: {
      "index.ts": {
        file: {
          contents: indexAssemblyScript,
        },
      },
    },
  },
  lib: {
    directory: {
      "setup-preview.js": {
        file: {
          contents: `/* This script sets up the preview window to it can interact with the editor. Feel free to remove this if you dont need it anymore. */\n${consoleReassign}\n${errorHandler}`,
        },
      },
    },
  },
  out: {
    directory: {
      "module.js": {
        file: {
          contents: "",
        },
      },
    },
  },
} as const;
