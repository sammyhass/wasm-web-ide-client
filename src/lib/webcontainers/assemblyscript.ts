import { useMutation } from "@tanstack/react-query";
import { WebContainer } from "@webcontainer/api";
import { useContainer } from ".";

const buildAssemblyScript = async (
  container: WebContainer,
  w?: WritableStream
) => {
  const processOut = await container?.spawn("npm", [
    "run",
    "build-assemblyscript",
  ]);

  w && processOut?.output?.pipeTo(w);

  return processOut.exit;
};

export const useBuildAssemblyScript = (logger?: (chunk: string) => void) => {
  const { data: container } = useContainer();
  return useMutation(() => {
    if (!container) throw new Error("Container not found");
    return buildAssemblyScript(
      container,
      new WritableStream({
        write(chunk) {
          logger && logger(chunk);
        },
      })
    );
  });
};
