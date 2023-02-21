const bootFiles = async (files: FileSystemTree) => {
  const container = await getContainer();
  await container?.mount(files);
  return container;
};

const installDependencies = async (w?: WritableStream<string>) => {
  const container = await getContainer();
  const processOut = await container?.spawn('npm', ['install']);
  w && processOut?.output?.pipeTo(w);

  return processOut.exit;
};

const startServer = async (w?: WritableStream<string>) => {
  const container = await getContainer();
  const processOut = await container?.spawn('npm', ['run', 'dev']);
  w && processOut?.output?.pipeTo(w);
  return processOut?.exit;
};

const setup = async (logger: (chunk: string) => void) => {
  await bootFiles(filesystem);
  visitFileTree(filesystem, (path, node) => {
    if (isFileNode(node)) {
      queryClient.setQueryData(['readFile', path], node.file.contents);
    }
  });

  const installerLogger = new WritableStream<string>({
    write(chunk) {
      logger(chunk);
    },
  });
  const installProcess = await installDependencies(installerLogger);
  if (installProcess !== 0) throw new Error('Failed to install dependencies');

  const startLogger = new WritableStream<string>({
    write(chunk) {
      logger(chunk);
    },
  });
  const startProcess = await startServer(startLogger);
  if (startProcess !== 0) throw new Error('Failed to start server');
};
