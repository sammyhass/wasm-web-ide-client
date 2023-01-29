import WasmIcon from '@/components/icons/WasmIcon';
import { useMe } from '@/hooks/useMe';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useMe();
  return (
    <div className="hero min-h-[80vh] ">
      <div className="hero-content bg-primary-content shadow-lg rounded-md p-20">
        <div className="flex flex-col items-center gap-10">
          <h1 className=" text-6xl gap-2 flex items-end font-mono p-2">
            <WasmIcon className="h-28 min-w-[100px]" />
            <span>IDE</span>
          </h1>
          <h1 className="text-4xl font-bold text-center  text-info-content ">
            Build crazy fast websites with{' '}
            <a
              className="text-primary hover:text-primary-focus transition-colors"
              href="https://webassembly.org/"
              referrerPolicy="no-referrer"
              target="_blank"
              rel="noreferrer"
            >
              WebAssembly
            </a>{' '}
            from the comfort of your browser.
          </h1>
          <Link href={user ? '/projects' : '/login'} passHref>
            <button className="btn btn-secondary btn-xl btn-wide">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
