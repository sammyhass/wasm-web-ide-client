import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { FileSystemTree, WebContainer } from '@webcontainer/api';
import { queryClient } from '../api/queryClient';
import { filesystem } from './files/defaults';
import { isFileNode, visitFileTree } from './util';

let container: WebContainer | null = null;

const buildAssemblyScript = async (w?: WritableStream) => {
  const container = await getContainer();
  const processOut = await container?.spawn('npm', [
    'run',
    'build-assemblyscript',
  ]);
  w && processOut?.output?.pipeTo(w);

  return processOut.exit;
};

const getContainer = async () => {
  if (container) return container;
  container = await WebContainer.boot();

  return container;
};

const bootFiles = async (files: FileSystemTree) => {
  const container = await getContainer();
  await container?.mount(files);
  return container;
};

const installDependencies = async (w?: WritableStream<string>) => {
  const container = await getContainer();
  const processOut = await container?.spawn('npm', ['install']);
  w && processOut?.output?.pipeTo(w);

  return processOut.exit;
};

const startServer = async (w?: WritableStream<string>) => {
  const container = await getContainer();
  const processOut = await container?.spawn('npm', ['run', 'dev']);
  w && processOut?.output?.pipeTo(w);
  return processOut?.exit;
};

const setup = async (logger: (chunk: string) => void) => {
  await bootFiles(filesystem);
  visitFileTree(filesystem, (path, node) => {
    if (isFileNode(node)) {
      queryClient.setQueryData(['readFile', path], node.file.contents);
    }
  });

  const installerLogger = new WritableStream<string>({
    write(chunk) {
      logger(chunk);
    },
  });
  const installProcess = await installDependencies(installerLogger);
  if (installProcess !== 0) throw new Error('Failed to install dependencies');

  const startLogger = new WritableStream<string>({
    write(chunk) {
      logger(chunk);
    },
  });
  const startProcess = await startServer(startLogger);
  if (startProcess !== 0) throw new Error('Failed to start server');
};

export const useBuildAssemblyScript = (logger?: (chunk: string) => void) =>
  useMutation(() =>
    buildAssemblyScript(
      new WritableStream({
        write(chunk) {
          logger && logger(chunk);
        },
      })
    )
  );

export const useContainer = (
  opts: UseQueryOptions<WebContainer | undefined, unknown> = {}
) =>
  useQuery<WebContainer | undefined>(['webcontainer'], () => getContainer(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...opts,
  });

export const useSetupContainer = (
  opts: UseMutationOptions<unknown, unknown> = {},
  logger?: (chunk: string) => void
) =>
  useMutation(
    ['setup-webcontainer'],
    () => {
      return setup(logger || (() => void 0));
    },
    {
      ...opts,
    }
  );
