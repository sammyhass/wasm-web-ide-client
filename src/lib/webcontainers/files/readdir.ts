import { useQuery } from '@tanstack/react-query';
import { WebContainer } from '@webcontainer/api';
import { useContainer } from '..';

const readDir = (container: WebContainer, path: string) =>
  container.fs.readdir(path, { withFileTypes: true, encoding: 'utf-8' });

export const useDirListing = () => {
  const { data: container } = useContainer();

  return useQuery(['readDir'], async () => {
    if (!container) return '';
    return readDir(container, '/');
  });
};
