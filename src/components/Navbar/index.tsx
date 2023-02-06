import dynamic from 'next/dynamic';
import HeaderImage from '../ui/HeaderImage';

const NavButtons = dynamic(() => import('./NavButtons'), {
  ssr: false,
});

export default function Navbar({
  title,
  className,
}: {
  title?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-2 bg-base-200 flex items-center justify-evenly ${
        className ? className : ''
      }`}
    >
      <div className="flex flex-1 items-end gap-2">
        <HeaderImage />
        <span className="text-xl font-sans pb-1" data-testid="navbar-title">
          {title}
        </span>
      </div>
      <NavButtons />
    </div>
  );
}
