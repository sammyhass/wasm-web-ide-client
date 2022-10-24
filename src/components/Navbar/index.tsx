import dynamic from 'next/dynamic';
import HeaderImage from '../HeaderImage';

const NavButtons = dynamic(() => import('./NavButtons'), {
  ssr: false,
});

export default function Navbar() {
  return (
    <div className="p-2 bg-base-200 flex items-center">
      <div className="flex-1">
        <HeaderImage />
      </div>
      <NavButtons />
    </div>
  );
}
