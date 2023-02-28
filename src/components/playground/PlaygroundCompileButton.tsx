import { useBuildAssemblyScript } from '@/lib/webcontainers/assemblyscript';
import { useDirListing } from '@/lib/webcontainers/files/dir';
import { useFileReader } from '@/lib/webcontainers/files/reader';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { useMonaco } from '@monaco-editor/react';
import { useEditorConsole } from '../ProjectEditor/ConsoleWindow';
import { ToolbarButton } from '../ProjectEditor/Toolbar';

export default function PlaygroundCompileButton() {
  const { push } = useEditorConsole();
  const { mutate: _mutate, isLoading } = useBuildAssemblyScript(c =>
    push('log', c)
  );
  const monaco = useMonaco();

  const { refetch: refetchTypings } = useFileReader('out/module.d.ts', {
    onSuccess: data => {
      monaco?.languages.typescript.javascriptDefaults.addExtraLib(
        data,
        'file:///playground/out/module.d.ts'
      );
    },
  });

  const { refetch: refetchFileTree } = useDirListing();

  const { refetch: refetchWat } = useFileReader('out/module.wat');
  const { refetch: refetchBindings } = useFileReader('out/module.js');

  const mutate = () => {
    _mutate(void 0, {
      onSuccess: () => {
        refetchBindings();
        refetchTypings();
        refetchWat();
        refetchFileTree();
      },
    });
  };

  return (
    <ToolbarButton
      data-testid="compile-to-wasm-button"
      onClick={() => !isLoading && mutate()}
      loading={isLoading}
      title="Compile to WebAssembly"
      icon={<PlayCircleIcon className="w-5 h-5 text-success" />}
    />
  );
}
