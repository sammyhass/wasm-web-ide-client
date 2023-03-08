import { useEditorConsole } from '@/components/ProjectEditor/ConsoleWindow';
import { useMutation } from '@tanstack/react-query';
import { WebContainer } from '@webcontainer/api';
import { useContainer } from '.';

const exportProject = async (
  container: WebContainer,
  w?: WritableStream<string>
) => {
  const processOut = await container?.spawn('npx', [
    'bestzip',
    './project.zip',
    'asconfig.json',
    'styles.css',
    'index.html',
    'package.json',
    'main.js',
    'out',
    'lib',
  ]);

  w && processOut?.output?.pipeTo(w);
  const exit = await processOut.exit;
  if (exit !== 0) {
    throw new Error('Failed to export project');
  }

  const zip = await container.fs.readFile('/project.zip');

  const blob = new Blob([zip], { type: 'application/zip' });

  await container.fs.rm('/project.zip');

  return blob;
};

export const useExportProject = () => {
  const { data: container } = useContainer();

  const { push } = useEditorConsole();

  return useMutation(
    ['exportProject'],
    async () => {
      if (!container) return;
      return exportProject(
        container,
        new WritableStream({
          write(chunk) {
            push('log', chunk);
          },
        })
      );
    },
    {
      onSuccess: d => {
        push('log', 'Project exported successfully');
      },
    }
  );
};
