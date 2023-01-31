import CompileToWasmButton from '@/components/ProjectEditor/Toolbar/CompileToWasmButton';
import { SaveButton } from './SaveButton';
import SettingsButton from './SettingsButton';

export default function Toolbar() {
  return (
    <div className="flex items-center gap-2 pl-2">
      <CompileToWasmButton />
      <SaveButton />
      <SettingsButton />
    </div>
  );
}

export function ToolbarButton({
  icon,
  title,
  loading,
  disabled,
  className,
  onClick,
  ...props
}: {
  icon: React.ReactNode;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`btn btn-sm normal-case gap-2 ${loading ? 'loading' : ''} ${
        disabled ? 'btn-disabled cursor-none' : ''
      } ${!!!title ? 'btn-square' : 'min-w-[10em] '} ${
        className ? className : ''
      }`}
      title={title}
      onClick={onClick}
      {...props}
    >
      {icon}
      {title}
    </button>
  );
}
