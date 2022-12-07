import { FileT } from '@/lib/api/services/projects';
import CssIcon from './CSSIcon';
import GoIcon from './GoIcon';
import HtmlIcon from './HtmlIcon';
import JavaScriptIcon from './JavaScriptIcon';

const icons: Record<FileT['language'], React.FC> = {
  go: GoIcon,
  html: HtmlIcon,
  css: CssIcon,
  js: JavaScriptIcon,
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
    <div className={`w-6 ${className}`}>
      {Icon ? <Icon /> : <span>{language}</span>}
    </div>
  );
}
