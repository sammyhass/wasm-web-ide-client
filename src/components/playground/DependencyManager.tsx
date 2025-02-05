import { useFileReader } from "@/lib/webcontainers/files/reader";
import {
  ArrowDownOnSquareStackIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useEditorConsole } from "../ProjectEditor/ConsoleWindow";

const installDependency = async (
  {
    dependency,
    dev = false,
  }: {
    dependency: string;
    dev: boolean;
  },
  logger: (msg: string) => void
) => {
  if (!window.webcontainer) {
    throw new Error("WebContainer not found");
  }
  if (!!!dependency) {
    throw new Error("No dependency provided");
  }

  const process = await window.webcontainer.spawn("npm", [
    "install",
    dev ? "--save-dev" : "--save",
    ...dependency.split(","),
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
    throw new Error("Failed to install dependency");
  }

  return code;
};

const removeDependency = async (
  dependencies: string[],
  logger: (msg: string) => void
) => {
  if (!window.webcontainer) {
    throw new Error("WebContainer not found");
  }

  const process = await window.webcontainer.spawn("npm", [
    "uninstall",
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
    throw new Error("Failed to remove dependency");
  }
  return code;
};

const useRemoveDependencies = () => {
  const push = useEditorConsole((s) => s.push);

  const qc = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (d: string[]) => removeDependency(d, (m) => push("log", m)),
    {
      onSuccess: (exitCode) => {
        if (exitCode !== 0) {
          console.log("Failed");
        }

        qc.refetchQueries(["readFile", "package.json"]);
      },
    }
  );

  return { mutate, isLoading };
};

const listDependencies = (packageJson: string) => {
  const json = JSON.parse(packageJson);

  let deps: Record<string, string> = {};
  let devDeps: Record<string, string> = {};
  if (json.dependencies) {
    deps = structuredClone(json.dependencies);
  }

  if (json.devDependencies) {
    devDeps = structuredClone(json.devDependencies);
  }

  return {
    dependencies: deps,
    devDependencies: devDeps,
  };
};

const useInstalledDependencies = () => {
  const { data } = useFileReader("package.json");

  return listDependencies(data ?? "{}");
};

function InstallDependencyForm() {
  const push = useEditorConsole((s) => s.push);
  const [dependency, setDependency] = useState("");
  const [dev, setDev] = useState(false);

  const qc = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (vars: { dependency: string; dev: boolean }) =>
      installDependency(vars, (m) => push("log", m)),
    {
      onSuccess: (exitCode) => {
        if (exitCode !== 0) {
          console.log("Failed");
        }

        setDependency("");

        qc.refetchQueries(["readFile", "package.json"]);
      },
    }
  );

  const install = useCallback(() => {
    mutate({ dependency, dev });
  }, [dependency, dev, mutate]);

  return (
    <>
      <h2 className="my-2 flex items-center gap-2 text-lg">
        <ArrowDownOnSquareStackIcon className="h-6 w-6 " />
        <span>Install Dependencies</span>
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          install();
        }}
        className="flex flex-col gap-2"
      >
        <div className="form-control">
          <label className="label cursor-pointer items-center justify-start gap-2 rounded-md hover:bg-base-200">
            <input
              type="checkbox"
              checked={dev}
              onChange={(e) => setDev(e.target.checked)}
              className="checkbox"
            />
            <span className="label-text">Install as Dev Dependency?</span>
          </label>
        </div>
        <div className="form-control flex flex-row items-center gap-2">
          <label className="input-group input-group-sm font-mono ">
            <input
              type="text"
              value={dependency}
              onChange={(e) => setDependency(e.target.value)}
              placeholder="e.g. lodash"
              className="input input-bordered flex-1 outline-1 focus:outline-primary"
            />
            <button
              type="submit"
              className={`btn btn-accent ${isLoading ? "loading" : ""}`}
              disabled={isLoading || !!!dependency}
            >
              Install
            </button>
          </label>
        </div>
      </form>
    </>
  );
}

export default function DependencyManager() {
  const deps = useInstalledDependencies();

  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(
    []
  );

  const { mutate, isLoading } = useRemoveDependencies();

  return (
    <>
      <InstallDependencyForm />
      {deps && (
        <>
          <hr className="my-4" />
          <h2 className="my-2 flex items-center gap-2 text-lg">
            <Square3Stack3DIcon className="h-6 w-6 " />
            <span>Installed Dependencies</span>
          </h2>
          <div className="flex h-full flex-col">
            <ul className="mb-2 flex flex-col gap-2">
              {Object.entries(deps ?? {}).map(([type, deps]) => (
                <>
                  <h3 className="font-mono text-sm font-semibold">{type}</h3>
                  <div
                    key={type}
                    className=" flex max-h-32 flex-col gap-2 overflow-y-auto"
                  >
                    {Object.entries(deps).length > 0 ? (
                      Object.entries(deps).map(([name, version]) => (
                        <label
                          className="label cursor-pointer gap-2 rounded-md hover:bg-base-300"
                          key={name}
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={selectedDependencies.includes(name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDependencies((prev) => [
                                  ...prev.filter((d) => d !== name),
                                  name,
                                ]);
                              } else {
                                setSelectedDependencies((prev) =>
                                  prev.filter((d) => d !== name)
                                );
                              }
                            }}
                          />
                          <span className="flex-1 font-mono">
                            <>
                              {name}@{version}
                            </>
                          </span>
                        </label>
                      ))
                    ) : (
                      <span className="text-base-400 w-full rounded-md bg-base-200 p-2 text-center text-sm">
                        No {type} installed
                      </span>
                    )}
                  </div>
                </>
              ))}
            </ul>
            <div className="btn-group ">
              <button
                className={`btn btn-outline btn-error btn-sm normal-case ${
                  isLoading ? "loading" : ""
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
                className="btn btn-outline btn-sm normal-case"
                onClick={() => setSelectedDependencies([])}
              >
                Reset Selection
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
