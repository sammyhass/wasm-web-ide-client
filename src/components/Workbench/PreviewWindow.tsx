import { useEditor } from '../ProjectEditor';
import { iframeContent } from './defaults';

export default function PreviewWindow() {
  const saveState = useEditor(s => s.lastSaved);

  const html = saveState
    .filter(f => f.name === 'index.html')
    .map(f => f.content)
    .join('');

  const js = saveState
    .filter(f => f.name.endsWith('.js'))
    .map(f => f.content)
    .join('');

  const css = saveState
    .filter(f => f.name.endsWith('.css'))
    .map(f => f.content)
    .join('');

  return (
    <>
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={iframeContent({
            html: html || '',
            js: js || '',
            css: css || '',
          })}
          className="w-full h-full"
          title="Preview"
        />
      </div>
    </>
  );
}
