import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';

export function PlaygroundPreview(props: { url: string }) {
  const previewRef = useRef<HTMLIFrameElement>(null);
  return (
    <div className="fit-content w-full h-full relative rounded-t-md overflow-hidden">
      <div className="flex items-center gap-2 p-2 w-full bg-base-300">
        {props.url.startsWith('https://') ? (
          <LockClosedIcon className="w-5 h-5 text-success" />
        ) : (
          <LockOpenIcon className="w-5 h-5 text-error" />
        )}
        <input
          readOnly
          className="input input-sm w-full bg-base-200 rounded-md p-2"
          value={props.url.startsWith('http') ? props.url : ''}
          onClick={e => {
            e.preventDefault();
            e.currentTarget.select();
          }}
          disabled={!props.url}
        />
      </div>
      <iframe
        title="Preview Window"
        ref={previewRef}
        className="w-full block h-full bg-white"
        src={props.url}
      />
    </div>
  );
}
