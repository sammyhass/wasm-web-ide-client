import WasmIcon from '@/components/icons/WasmIcon';
import { FileT } from '@/lib/api/services/projects';
import type { FC } from 'react';
import CssIcon from './CSSIcon';
import GoIcon from './GoIcon';
import HtmlIcon from './HtmlIcon';
import JavaScriptIcon from './JavaScriptIcon';

const icons: Record<FileT['language'], FC> = {
  go: GoIcon,
  html: HtmlIcon,
  css: CssIcon,
  js: JavaScriptIcon,
  wasm: WasmIcon,
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
    <div className={`w-6 max-h-fit ${className}`}>
      {Icon ? <Icon /> : <span>{language}</span>}
    </div>
  );
}
