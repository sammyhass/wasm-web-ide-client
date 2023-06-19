import { getDirListing } from "@/lib/webcontainers/files/dir";
import { useQuery } from "@tanstack/react-query";
import { FileSystemTree } from "@webcontainer/api";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useToast } from "../Toast";
import LoadingSpinner from "../icons/Spinner";

export default function LinkGenerator() {
  const show = useToast((s) => s.show);

  const router = useRouter();

  const { data, isLoading } = useQuery(
    ["playground-link"],
    async () => {
      if (!window.webcontainer) return;

      const tree = await getDirListing(window.webcontainer, "/", {}, true);

      const res = await fetch("/api/link", {
        method: "POST",
        body: JSON.stringify({
          ...tree,
          out: {
            directory: {
              "module.js": {
                file: {
                  contents: "",
                },
              },
            },
          },
        } as FileSystemTree),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      return json as { code: string };
    },
    {
      cacheTime: 0,
      staleTime: 0,
      onSuccess: (data) => {
        show({
          id: "playground-link-success",
          message: "Playground link generated!",
          type: "success",
        });

        if (!data?.code || data.code === router.query.code) return;

        router.push(`/playground?code=${data.code}`, undefined, {
          shallow: true,
        });
      },
    }
  );

  const link = useMemo(
    () => `${window.location.origin}/playground?code=${data?.code}`,
    [data]
  );

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(link);
    show({
      id: "link-copied",
      message: "Playground link copied to clipboard!",
      type: "success",
    });
  }, [link, show]);

  return (
    <div className="min-h-16 relative">
      {isLoading && (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
          <div className="flex gap-2">
            <LoadingSpinner /> Generating Link...
          </div>
        </div>
      )}

      {data && (
        <div className="flex max-w-full flex-col gap-2 overflow-hidden">
          <p className="text-sm text-gray-500">
            Click the link below to copy it to your clipboard.
          </p>
          <button
            className="relative break-words rounded-md bg-base-300 p-3 text-xs hover:underline"
            onClick={copyToClipboard}
          >
            <code>{link}</code>
          </button>
        </div>
      )}
    </div>
  );
}
