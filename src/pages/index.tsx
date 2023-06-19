import WasmIcon from "@/components/icons/WasmIcon";
import { useMeQuery } from "@/hooks/useMe";
import Link from "next/link";

export default function HomePage() {
  const { data: user } = useMeQuery(false);
  return (
    <div className="hero mt-5 md:min-h-[80vh]">
      <div className="hero-content rounded-md bg-primary-content shadow-lg sm:p-5 md:p-20">
        <div className="flex flex-col items-center gap-2 md:gap-10">
          <h1 className="flex items-end gap-2 p-2 font-mono text-2xl md:text-6xl">
            <WasmIcon className="h-16 w-16 md:h-28 md:w-28" />
            <span>IDE</span>
          </h1>
          <h1 className="text-center text-xl font-bold text-info-content  md:text-4xl ">
            Build websites with{" "}
            <a
              className="text-primary transition-colors hover:text-primary-focus"
              href="https://webassembly.org/"
              referrerPolicy="no-referrer"
              target="_blank"
              rel="noreferrer noopener"
            >
              WebAssembly
            </a>{" "}
            from the comfort of your browser.
          </h1>

          <div className="btn-group btn-group-vertical items-center gap-5">
            <Link href={user ? "/projects" : "/login"} passHref>
              <button className="btn btn-accent btn-wide md:btn-xl">
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
