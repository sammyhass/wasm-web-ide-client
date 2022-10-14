import Link from 'next/link';
import HeaderImage from './HeaderImage';

export default function Navbar() {
  return (
    <div className="p-2 bg-base-200 flex items-center">
      <div className="flex-1">
        <HeaderImage />
      </div>
      <div className="mx-2 flex gap-2">
        <Link href="/login" passHref>
          <a>
            <button className="btn btn-info">Login</button>
          </a>
        </Link>
      </div>
    </div>
  );
}
