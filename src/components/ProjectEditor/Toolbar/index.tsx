import CompileToWasmButton from "@/components/ProjectEditor/Toolbar/CompileToWasmButton";
import LoadingSpinner from "../../icons/Spinner";
import { SaveButton } from "./SaveButton";
import SettingsButton from "./SettingsButton";
import WatViewerWrapper from "./WatViewer";

export default function Toolbar() {
  return (
    <ul className="menu menu-horizontal w-full bg-base-300">
      <CompileToWasmButton />
      <SaveButton />
      <WatViewerWrapper />
      <SettingsButton />
    </ul>
  );
}

export function ToolbarButton({
  icon,
  title,
  tooltip,
  loading,
  disabled,
  className,
  onClick,
  ...props
}: {
  icon: React.ReactNode;
  title?: string;
  tooltip?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <li
      className={`${tooltip ? "tolltip- tooltip z-10" : "relative"} ${
        disabled ? "disabled" : ""
      }`}
      data-tip={tooltip}
    >
      <button
        className={`flex items-center justify-center gap-2 normal-case  ${
          className ? className : ""
        }`}
        disabled={disabled}
        title={title}
        onClick={onClick}
        {...props}
      >
        {loading ? <LoadingSpinner className="h-5 w-5" /> : icon}
        {title}
      </button>
    </li>
  );
}
