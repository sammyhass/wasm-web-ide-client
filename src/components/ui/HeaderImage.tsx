import Link from "next/link";
import WasmIcon from "../icons/WasmIcon";

export default function HeaderImage({ className }: { className?: string }) {
  return (
    <Link href="/">
      <button
        className={`${className} btn btn-outline min-h-12 btn-md flex animate-none items-center bg-base-200 font-mono text-xl font-normal `}
      >
        <div className="flex items-end gap-1">
          <WasmIcon className="h-10 w-8" />
          IDE
        </div>
      </button>
    </Link>
  );
}
