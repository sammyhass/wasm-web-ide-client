import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";

export default function PlaygroundPreview(props: { url: string }) {
  const previewRef = useRef<HTMLIFrameElement>(null);
  return (
    <div className="fit-content relative h-full w-full overflow-hidden rounded-t-md">
      <div className="flex w-full items-center gap-2 bg-base-300 p-2">
        {props.url.startsWith("https://") ? (
          <LockClosedIcon className="h-5 w-5 text-success" />
        ) : (
          <LockOpenIcon className="h-5 w-5 text-error" />
        )}
        <input
          readOnly
          className="input input-sm w-full rounded-md bg-base-200 p-2"
          value={props.url.startsWith("http") ? props.url : ""}
          onClick={(e) => {
            e.preventDefault();
            e.currentTarget.select();
          }}
          disabled={!props.url}
        />
      </div>
      <iframe
        title="Preview Window"
        ref={previewRef}
        data-testid="preview-window"
        className="block h-full w-full bg-white"
        src={props.url}
      />
    </div>
  );
}
