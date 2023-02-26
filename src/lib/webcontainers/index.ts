import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { FileSystemTree, WebContainer } from '@webcontainer/api';
import { queryClient } from '../api/queryClient';
import { isFileNode, visitFileTree } from './util';

declare global {
  interface Window {
    webcontainer: WebContainer | undefined;
  }
}

const boot = async () => {
  if (typeof window === undefined || window.webcontainer) {
    return;
  }

  window.webcontainer = await WebContainer.boot();
};

const getContainer = () => {
  if (!window.webcontainer) {
    throw new Error('WebContainer not booted');
  }
  return window.webcontainer;
};

const bootFiles = async (files: FileSystemTree) => {
  const container = getContainer();
  await container?.mount(files);
  return container;
};

const installDependencies = async (w?: WritableStream<string>) => {
  const container = getContainer();
  const processOut = await container?.spawn('npm', ['install']);
  w && processOut?.output?.pipeTo(w);

  return processOut.exit;
};

const startServer = async (w?: WritableStream<string>) => {
  const container = getContainer();
  const processOut = await container?.spawn('npm', ['run', 'dev']);
  w && processOut?.output?.pipeTo(w);
  return processOut?.exit;
};

const setup = async (
  files: FileSystemTree,
  logger: (chunk: string) => void
) => {
  await bootFiles(files);
  visitFileTree(files, (path, node) => {
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

export const destroyContainer = () => {
  window.webcontainer?.teardown();
  window.webcontainer = undefined;
};

export const useSetup = (
  logger: (chunk: string) => void,
  opts?: UseMutationOptions<void, unknown, FileSystemTree>
) => useMutation((files: FileSystemTree) => setup(files, logger), opts);

export const useContainer = (
  options?: UseQueryOptions<WebContainer | undefined>
) =>
  useQuery<WebContainer | undefined>(
    ['useContainer'],
    async () => {
      await boot();
      if (!window.webcontainer) {
        throw new Error('WebContainer not booted');
      }
      return window.webcontainer;
    },
    {
      enabled: typeof window !== 'undefined',
      retryOnMount: true,
      initialData:
        typeof window !== 'undefined' ? window.webcontainer : undefined,
      ...options,
    }
  );
