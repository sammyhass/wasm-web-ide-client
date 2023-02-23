import { useFileReader } from '@/lib/webcontainers/files/reader';
import { Dialog } from '@headlessui/react';
import {
  ArrowDownOnSquareStackIcon,
  FolderIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useEditorConsole } from '../ProjectEditor/ConsoleWindow';
import { ToolbarButton } from '../ProjectEditor/Toolbar';

const installDependency = async (
  dependency: string,
  logger: (msg: string) => void
) => {
  if (!window.webcontainer) {
    throw new Error('WebContainer not found');
  }
  if (!!!dependency) {
    throw new Error('No dependency provided');
  }

  const process = await window.webcontainer.spawn('npm', [
    'install',
    dependency,
  ]);
  process.output.pipeTo(
    new WritableStream({
      write(chunk) {
        logger(chunk);
      },
    })
  );

  const code = await process.exit;

  if (code !== 0) {
    throw new Error('Failed to install dependency');
  }

  return code;
};

const removeDependency = async (
  dependencies: string[],
  logger: (msg: string) => void
) => {
  if (!window.webcontainer) {
    throw new Error('WebContainer not found');
  }

  const process = await window.webcontainer.spawn('npm', [
    'uninstall',
    ...dependencies,
  ]);

  process.output.pipeTo(
    new WritableStream({
      write(chunk) {
        logger(chunk);
      },
    })
  );
  const code = await process.exit;

  if (code !== 0) {
    throw new Error('Failed to remove dependency');
  }
  return code;
};

const useRemoveDependencies = () => {
  const push = useEditorConsole(s => s.push);

  const qc = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (d: string[]) => removeDependency(d, m => push('log', m)),
    {
      onSuccess: exitCode => {
        if (exitCode !== 0) {
          console.log('Failed');
        }

        qc.refetchQueries(['readFile', 'package.json']);
      },
    }
  );

  return { mutate, isLoading };
};

const listDependencies = (packageJson: string) => {
  const json = JSON.parse(packageJson);

  if (json.dependencies) {
    return json.dependencies as Record<string, string>;
  }
};

const useInstalledDependencies = () => {
  const { data } = useFileReader('package.json');

  return listDependencies(data ?? '{}');
};

function InstallDependencyForm() {
  const push = useEditorConsole(s => s.push);
  const [dependency, setDependency] = useState('');

  const qc = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (d: string) => installDependency(d, m => push('log', m)),
    {
      onSuccess: exitCode => {
        if (exitCode !== 0) {
          console.log('Failed');
        }

        setDependency('');

        qc.refetchQueries(['readFile', 'package.json']);
      },
    }
  );

  return (
    <>
      <h2 className="text-lg my-2 flex items-center gap-2">
        <ArrowDownOnSquareStackIcon className="h-6 w-6 " />
        <span>Install Dependencies</span>
      </h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          mutate(dependency);
        }}
        className="flex flex-row items-center gap-2 form-control"
      >
        <label className="input-group font-mono input-group-sm ">
          <input
            type="text"
            value={dependency}
            onChange={e => setDependency(e.target.value)}
            placeholder="react"
            className="input input-bordered flex-1 "
          />
          <button
            type="submit"
            className={`btn btn-accent ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !!!dependency}
          >
            Install
          </button>
        </label>
      </form>
    </>
  );
}

function DependencyManager() {
  const deps = useInstalledDependencies();

  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(
    []
  );

  const { mutate, isLoading } = useRemoveDependencies();

  return (
    <>
      {deps && (
        <>
          <h2 className="text-lg my-2 flex items-center gap-2">
            <Square3Stack3DIcon className="h-6 w-6 " />
            <span>Installed Dependencies</span>
          </h2>
          <div className="flex flex-col h-full">
            <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-2">
              {Object.entries(deps ?? {}).map(([name, version]) => (
                <label
                  className="label cursor-pointer hover:bg-opacity-25 hover:bg-base-300 gap-2"
                  key={name}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedDependencies.includes(name)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedDependencies(prev => [
                          ...prev.filter(d => d !== name),
                          name,
                        ]);
                      } else {
                        setSelectedDependencies(prev =>
                          prev.filter(d => d !== name)
                        );
                      }
                    }}
                  />
                  <span className="font-mono flex-1">
                    {name}@{version}
                  </span>
                </label>
              ))}
            </ul>
            <div className="btn-group ">
              <button
                className={`btn btn-outline btn-error btn-sm normal-case ${
                  isLoading ? 'loading' : ''
                }`}
                disabled={isLoading || selectedDependencies.length === 0}
                onClick={() => {
                  mutate(selectedDependencies);
                  setSelectedDependencies([]);
                }}
              >
                Remove Selected Dependencies
              </button>
              <button
                className="btn btn-sm btn-outline normal-case"
                onClick={() => setSelectedDependencies([])}
              >
                Reset Selection
              </button>
            </div>
          </div>
          <hr className="my-4" />
        </>
      )}
      <InstallDependencyForm />
    </>
  );
}

export default function DependencyManagerWrapper() {
  const [show, setShow] = useState(false);
  return (
    <>
      <ToolbarButton
        icon={<FolderIcon className="h-5 w-5" />}
        onClick={() => setShow(!show)}
        title="Manage Dependencies"
      />
      <Dialog
        open={show}
        onClose={() => setShow(false)}
        className={`modal ${show ? 'modal-open' : ''}`}
      >
        <Dialog.Panel className={'modal-box'}>
          <Dialog.Title className={'text-xl'} as="h2">
            Manage Dependencies
          </Dialog.Title>
          <hr className="my-4" />
          <DependencyManager />
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
