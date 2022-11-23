import { ToolbarButton } from '@/components/ProjectEditor/Toolbar';
import { useToast } from '@/components/Toast';
import { useWasmReady } from '@/hooks/useWasmReady';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { useEditor } from '..';

export default function CompileToWasmButton() {
  const { show } = useToast();

  const wasmReady = useWasmReady(s => s.isReady);

  const files = useEditor(s => s.files);
  const goCode = useMemo(
    () => files.find(f => f.language === 'go')?.content || '',
    [files]
  );

  return (
    <ToolbarButton
      onClick={() => {
        alert('TODO!');
      }}
      title="Compile to WebAssembly"
      icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
    />
  );
}
