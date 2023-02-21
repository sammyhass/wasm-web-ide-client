import { useExportProject } from '@/lib/webcontainers/archive';
import { ArrowDownCircleIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';
import { ToolbarButton } from '../ProjectEditor/Toolbar';

export default function DownloadButton() {
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const { mutate: _mutate, isLoading } = useExportProject();

  const mutate = () => {
    return _mutate(void 0, {
      onSuccess: data => {
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
      <ToolbarButton
        onClick={() => mutate()}
        title="Download Project"
        loading={isLoading}
        icon={<ArrowDownCircleIcon className="w-5 h-5" />}
      />
      <a
        id="download"
        ref={downloadRef}
        download="project.zip"
        style={{ display: 'none' }}
      >
        Download
      </a>
    </>
  );
}
