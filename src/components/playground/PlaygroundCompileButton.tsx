import { useBuildAssemblyScript } from "@/lib/webcontainers/assemblyscript";
import { useDirListing } from "@/lib/webcontainers/files/dir";
import { useFileReader } from "@/lib/webcontainers/files/reader";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { useMonaco } from "@monaco-editor/react";
import { useEditorConsole } from "../ProjectEditor/ConsoleWindow";
import { ToolbarButton } from "../ProjectEditor/Toolbar";
import { useToast } from "../Toast";

export default function PlaygroundCompileButton() {
  const { push } = useEditorConsole();
  const show = useToast((s) => s.show);

  const { mutate: _mutate, isLoading } = useBuildAssemblyScript((c) =>
    push("log", c)
  );
  const monaco = useMonaco();

  const { refetch: refetchTypings } = useFileReader("out/module.d.ts", {
    onSuccess: (data) => {
      monaco?.languages.typescript.javascriptDefaults.addExtraLib(
        data,
        "file:///playground/out/module.d.ts"
      );
    },
  });

  const { refetch: refetchFileTree } = useDirListing();

  const { refetch: refetchWat } = useFileReader("out/module.wat");
  const { refetch: refetchBindings } = useFileReader("out/module.js");

  const mutate = () => {
    _mutate(void 0, {
      onSuccess: () => {
        refetchBindings();
        refetchTypings();
        refetchWat();
        refetchFileTree();
        show({
          id: "playground-compile-success",
          message: "AssemblyScript successfully compiled to WebAssembly",
          type: "success",
        });
      },
      onError: () => {
        show({
          id: "playground-compile-fail",
          message:
            "Compilation failed, check the console for error information",
          type: "error",
        });
      },
    });
  };

  return (
    <ToolbarButton
      data-testid="compile-to-wasm-button"
      onClick={() => !isLoading && mutate()}
      loading={isLoading}
      title="Compile to WebAssembly"
      icon={<PlayCircleIcon className="h-5 w-5 text-success" />}
    />
  );
}
