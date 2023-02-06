import Link from 'next/link';
import WasmIcon from '../icons/WasmIcon';

export default function HeaderImage({ className }: { className?: string }) {
  return (
    <Link href="/">
      <button
        className={`${className} bg-base-200 btn btn-outline font-mono min-h-12 btn-md text-xl font-normal animate-none flex items-center `}
      >
        <div className="flex gap-1 items-end">
          <WasmIcon className="w-8 h-10" />
          IDE
        </div>
      </button>
    </Link>
  );
}
