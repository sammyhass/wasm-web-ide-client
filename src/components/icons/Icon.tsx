import GoIcon from './GoIcon';
import HtmlIcon from './HtmlIcon';
import JavaScriptIcon from './JavaScriptIcon';
import TypeScriptIcon from './TypeScriptIcon';

const getIcon = (language: string) => {
  switch (language) {
    case 'javascript':
      return JavaScriptIcon;
    case 'typescript':
      return TypeScriptIcon;
    case 'go':
      return GoIcon;
    case 'html':
      return HtmlIcon;
    default:
      return null;
  }
};

export default function LanguageIcon({ language }: { language: string }) {
  const Icon = getIcon(language);

  return <div className="w-6">{Icon ? <Icon /> : <span>{language}</span>}</div>;
}
