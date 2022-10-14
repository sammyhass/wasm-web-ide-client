import create from 'zustand';

// Helpful for checking whether we loaded in the wasm_exec_tiny.js script
export const useWasmReady = create<{
  isReady: boolean;
  ready: () => void;
}>(set => ({
  isReady: false,
  ready: () => set({ isReady: true }),
}));
