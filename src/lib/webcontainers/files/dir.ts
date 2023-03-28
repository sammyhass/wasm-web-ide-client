import { queryClient } from '@/lib/api/queryClient';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { FileSystemTree, WebContainer } from '@webcontainer/api';
import { useContainer } from '..';

const EXCLUDE = ['node_modules', 'lib', 'package-lock.json'];
export const getDirListing = async (
  container: WebContainer,
  path: string,
  res: FileSystemTree = {},
  includeContents = false
) => {
  const contents = await container.fs.readdir(path, {
    withFileTypes: true,
    encoding: 'utf-8',
  });

  contents.sort((a, b) => {
    if (a.isFile() && b.isDirectory()) return -1;
    if (a.isDirectory() && b.isFile()) return 1;
    return 0;
  });

  for (const dirent of contents) {
    if (EXCLUDE.includes(dirent.name)) continue;

    if (dirent.isFile()) {
      const readPath = `${path === '/' ? '' : path}/${dirent.name}`.replace(
        /^\/+/,
        ''
      );
      res[dirent.name] = {
        file: {
          contents: includeContents
            ? queryClient.getQueryData(['readFile', readPath]) || ''
            : '',
        },
      };
    } else if (dirent.isDirectory()) {
      const dir = await getDirListing(
        container,
        `${path}/${dirent.name}`,
        {},
        includeContents
      );

      res[dirent.name] = {
        directory: dir,
      };
    }
  }
  return res;
};

type DataT = Awaited<ReturnType<typeof getDirListing>>;
type QueryT = UseQueryOptions<DataT, unknown>;

// dir listing represents the filesystem tree, it does not contain the file contents unless includeContents is true
export const useDirListing = (opts: QueryT = {}) => {
  const { data: container } = useContainer();
  return useQuery<DataT>(
    ['dirListing'],
    async () => {
      if (!container) return {};
      return getDirListing(container, '/', {});
    },
    {
      enabled: !!container,
      ...opts,
    }
  );
};
