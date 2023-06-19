import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WebContainer } from "@webcontainer/api";
import { useRef, useState } from "react";
import { useContainer } from "..";
import { useDirListing } from "./dir";

const createFileWriter = (container: WebContainer, path: string) => {
  return (value: string) => container.fs.writeFile(path, value, "utf-8");
};

export const useCreateFolder = () => {
  const { data: container } = useContainer();

  return useMutation(async (path: string) => {
    if (!container) return;

    return container.fs.mkdir(path);
  });
};

export const useCreateFile = () => {
  const { data: container } = useContainer();

  const queryCache = useQueryClient();

  return useMutation(
    async (path: string) => {
      if (!container) return;

      return createFileWriter(container, path)("");
    },
    {
      onMutate: async (path) => {
        await queryCache.invalidateQueries(["dirListing", true]);
        await queryCache.cancelQueries(["readFile", path]);
        const previousValue = queryCache.getQueryData(["readFile", path]);
        queryCache.setQueryData(["readFile", path], "");
        return previousValue;
      },
    }
  );
};

export const useRemoveNode = () => {
  const { data: container } = useContainer();
  const { refetch } = useDirListing();

  const queryCache = useQueryClient();

  return useMutation(
    async (path: string) => {
      if (!container) return;
      await container.fs.rm(path, {
        recursive: true,
      });
      return path;
    },
    {
      onSuccess: (d, e, path) => {
        queryCache.removeQueries(["readFile", path]);
        refetch();
      },
    }
  );
};

export const useFileWriter = (path: string) => {
  const { data: container } = useContainer();

  const queryCache = useQueryClient();
  return useMutation(
    async (value: string) => {
      if (!container) return;
      return createFileWriter(container, path)(value);
    },
    {
      onMutate: async (value) => {
        await queryCache.cancelQueries(["readFile", path]);
        const previousValue = queryCache.getQueryData(["readFile", path]);
        queryCache.setQueryData(["readFile", path], value);
        return previousValue;
      },
    }
  );
};

export const useDebouncedWriter = (filename: string, timeout = 500) => {
  const { mutate: write, ...mutation } = useFileWriter(filename);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedWrite = (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      write(value, {
        onSuccess: () => {
          setLoading(false);
        },
      });
      timeoutRef.current = null;
    }, timeout);
  };

  return {
    write: debouncedWrite,
    ...mutation,
    isLoading: loading,
  };
};
