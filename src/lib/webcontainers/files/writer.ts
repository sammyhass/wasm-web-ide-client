import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WebContainer } from '@webcontainer/api';
import { useRef, useState } from 'react';
import { useContainer } from '..';

const createFileWriter = (container: WebContainer, path: string) => {
  return (value: string) => container.fs.writeFile(path, value, 'utf-8');
};

export const useFileWriter = (path: string) => {
  const { data: container } = useContainer();

  const queryCache = useQueryClient();
  return useMutation(
    ['writeFile', path],
    async (value: string) => {
      if (!container) return;

      return createFileWriter(container, path)(value);
    },
    {
      onMutate: async value => {
        await queryCache.cancelQueries(['readFile', path]);
        const previousValue = queryCache.getQueryData(['readFile', path]);
        queryCache.setQueryData(['readFile', path], value);
        return previousValue;
      },
    }
  );
};

export const useDebouncedWriter = (filename: string, timeout = 500) => {
  const { mutate: write, ...mutation } = useFileWriter(filename);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedWrite = (content: string) => {
    setLoading(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      write(content, {
        onSuccess: () => {
          setLoading(false);
        },
      });
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  };

  return {
    write: debouncedWrite,
    ...mutation,
    isLoading: loading,
  };
};
