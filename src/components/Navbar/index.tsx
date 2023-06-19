import dynamic from "next/dynamic";
import HeaderImage from "../ui/HeaderImage";

const NavButtons = dynamic(() => import("./NavButtons"), {
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
      className={`flex items-center justify-evenly bg-base-200 p-2 ${
        className ? className : ""
      }`}
    >
      <div className="flex flex-1 items-end gap-2">
        <HeaderImage />
        <span className="pb-1 font-sans text-xl" data-testid="navbar-title">
          {title}
        </span>
      </div>
      <NavButtons />
    </div>
  );
}
