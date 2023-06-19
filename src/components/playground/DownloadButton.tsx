import { useExportProject } from "@/lib/webcontainers/archive";
import { useRef } from "react";

export default function DownloadButton() {
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const { mutate: _mutate, isLoading } = useExportProject();

  const mutate = () => {
    return _mutate(void 0, {
      onSuccess: (data) => {
        if (!data) return;
        const _url = URL.createObjectURL(data);
        if (!downloadRef.current) return;

        downloadRef.current.href = _url;
        downloadRef.current.click();
      },
    });
  };

  return (
    <>
      <button
        onClick={() => mutate()}
        title="Download Project"
        className={`btn btn-primary ${
          isLoading ? "loading" : ""
        } w-full normal-case`}
      >
        Download Project as ZIP
      </button>
      <a
        id="download"
        ref={downloadRef}
        download="project.zip"
        style={{ display: "none" }}
      >
        Download
      </a>
    </>
  );
}
