import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="hero min-h-[80vh] ">
      <div className="hero-content bg-primary-content shadow-lg rounded-md p-20">
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-6xl font-bold text-accent">WASM IDE</h1>
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
          <Link href="/editor" passHref>
            <button className="btn btn-secondary btn-xl btn-wide">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
