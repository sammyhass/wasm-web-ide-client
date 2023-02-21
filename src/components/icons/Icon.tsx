import WasmIcon from '@/components/icons/WasmIcon';
import { FileT } from '@/lib/api/services/projects';
import { DocumentIcon } from '@heroicons/react/24/outline';
import type { FC } from 'react';
import AssemblyScriptIcon from './AssemblyScriptIcon';
import CssIcon from './CSSIcon';
import GoIcon from './GoIcon';
import HtmlIcon from './HtmlIcon';
import JavaScriptIcon from './JavaScriptIcon';

const icons: Record<FileT['language'], FC> = {
  go: GoIcon,
  html: HtmlIcon,
  css: CssIcon,
  json: JavaScriptIcon,
  wat: WasmIcon,
  js: JavaScriptIcon,
  wasm: WasmIcon,
  ts: AssemblyScriptIcon,
};

export default function LanguageIcon({
  language,
  className,
}: {
  language: FileT['language'];
  className?: string;
}) {
  const Icon = icons[language];

  return (
    <div
      className={`min-w-[2em] max-h-fit ${className}`}
      title={`${language} icon`}
    >
      {Icon ? <Icon /> : <DocumentIcon />}
    </div>
  );
}
