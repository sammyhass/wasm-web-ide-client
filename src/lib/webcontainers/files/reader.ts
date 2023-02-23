import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { WebContainer } from '@webcontainer/api';
import { useContainer } from '..';

const createFileReader = (container: WebContainer, path: string) => {
  return async () => container.fs.readFile(path, 'utf-8');
};

export const useFileReader = (
  path: string,
  opts: UseQueryOptions<string, unknown> = {}
) => {
  const { data: container } = useContainer();

  return useQuery<string>(
    ['readFile', path],
    async () => {
      if (!container) return '';
      return createFileReader(container, path)();
    },
    {
      enabled: !!container,
      ...opts,
    }
  );
};
