import { FileT } from '@/lib/api/services/projects';
import CssIcon from './CSSIcon';
import GoIcon from './GoIcon';
import HtmlIcon from './HtmlIcon';
import JavaScriptIcon from './JavaScriptIcon';
import GoModIcon from "@/components/icons/GoModIcon";
import WasmIcon from "@/components/icons/WasmIcon";
import type { FC } from "react";

const icons: Record<FileT['language'], FC> = {
  go: GoIcon,
  html: HtmlIcon,
  css: CssIcon,
  js: JavaScriptIcon,
  mod: GoModIcon,
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
