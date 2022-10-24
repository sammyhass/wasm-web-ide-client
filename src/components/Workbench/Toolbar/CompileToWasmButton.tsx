import { useToast } from '@/components/Toast';
import { useWorkbench } from '@/components/Workbench';
import { ToolbarButton } from '@/components/Workbench/Toolbar';
import { useWasmReady } from '@/hooks/useWasmReady';
import { API_URL } from '@/lib/api/axios';
import { compileToWasm } from '@/lib/api/services/wasm';
import { runWASM } from '@/lib/wasm';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function CompileToWasmButton() {
  const { show } = useToast();

  const wasmReady = useWasmReady(s => s.isReady);

  const files = useWorkbench(s => s.files);
  const goCode = useMemo(
    () => files.find(f => f.name === 'main.go')?.value,
    [files]
  );

  const { mutate, isLoading } = useMutation(['compileToWasm'], compileToWasm, {
    onSuccess: data => {
      runWASM(`${API_URL}${data.path}`);
      show({
        id: 'compile-success',
        message: 'Compiled successfully',
        type: 'success',
      });
    },
    onError: err => {
      show({
        id: 'compile-error',
        message: `Error compiling: ${err}`,
        type: 'error',
      });
    },
  });

  return (
    <ToolbarButton
      onClick={() => {
        mutate(goCode || '');
      }}
      title="Compile to WebAssembly"
      icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
      disabled={!goCode || !wasmReady}
      loading={isLoading}
      className="btn-secondary"
    />
  );
}
