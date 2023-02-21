import WasmIcon from '@/components/icons/WasmIcon';
import { useMeQuery } from '@/hooks/useMe';
import Link from 'next/link';

export default function HomePage() {
  const { data: user } = useMeQuery(false);
  return (
    <div className="hero md:min-h-[80vh] mt-5">
      <div className="hero-content bg-primary-content shadow-lg rounded-md sm:p-5 md:p-20">
        <div className="flex flex-col items-center gap-2 md:gap-10">
          <h1 className="text-2xl md:text-6xl gap-2 flex items-end font-mono p-2">
            <WasmIcon className="h-16 w-16 md:h-28 md:w-28" />
            <span>IDE</span>
          </h1>
          <h1 className="text-xl md:text-4xl font-bold text-center  text-info-content ">
            Build websites with{' '}
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

          <div className="btn-group-vertical btn-group items-center gap-5">
            <Link href={user ? '/projects' : '/login'} passHref>
              <button className="btn btn-accent md:btn-xl btn-wide">
                Get Started
              </button>
            </Link>
            <Link href="/playground">
              <button className="btn btn-info btn-md text-white">
                Check out the WebContainers Playground
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
