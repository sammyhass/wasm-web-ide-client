import Link from 'next/link';

export default function HeaderImage() {
  return (
    <Link href="/">
      <a>
        <button className="btn btn-ghost btn-md text-xl">WASM IDE</button>
      </a>
    </Link>
  );
}
