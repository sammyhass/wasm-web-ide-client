import CompileToWasmButton from '@/components/Workbench/Toolbar/CompileToWasmButton';
import { PreviewButton } from './PreviewButton';

export default function Toolbar() {
  return (
    <div className="flex items-center gap-2 pl-2">
      <CompileToWasmButton />
      <PreviewButton />
    </div>
  );
}

export function ToolbarButton({
  icon,
  title,
  loading,
  className,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`btn btn-sm normal-case gap-2 ${loading ? 'loading' : ''} ${
        disabled ? 'btn-disabled cursor-none' : ''
      } ${!!!title ? 'btn-square' : 'min-w-[10em] '} ${className}`}
      title={title}
      onClick={onClick}
    >
      {icon}
      {title}
    </button>
  );
}
