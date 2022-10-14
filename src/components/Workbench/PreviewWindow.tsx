import { useWorkbench } from '.';
import { iframeContent } from './defaults';

export default function PreviewWindow() {
  const saveState = useWorkbench(s => s.lastSaved);

  const html = saveState
    .filter(f => f.name === 'index.html')
    .map(f => f.value)
    .join('');

  const js = saveState
    .filter(f => f.name.endsWith('.js'))
    .map(f => f.value)
    .join('');

  return (
    <>
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={iframeContent({
            html: html || '',
            js: js || '',
          })}
          className="w-full h-full"
          title="Preview"
        />
      </div>
    </>
  );
}
