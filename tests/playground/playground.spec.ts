import { filesystem } from '@/lib/webcontainers/files/defaults';
import {
  findNode,
  isDirectoryNode,
  visitFileTree,
} from '@/lib/webcontainers/util';
import { Page, expect, test } from '@playwright/test';
import { DirectoryNode, FileNode } from '@webcontainer/api';
import { PlaygroundPage } from '../util/pom/PlaygroundPage';

let page: Page;
let pom: PlaygroundPage;

let firstFile: { path: string; node: DirectoryNode | FileNode } | undefined;
let firstFolder: { path: string; node: DirectoryNode | FileNode } | undefined;

test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Playground is only supported in Chromium based browsers'
);
test.slow();
test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();

  await page.goto('/playground');
  await page.waitForLoadState('networkidle');

  pom = new PlaygroundPage(page);
});

test('playground mounts the file tree', async ({}) => {
  await pom.fileTree.waitFor();

  const textContent = await pom.fileTree.textContent();

  const tlFiles = Object.keys(filesystem).filter(p => !p.includes('lib'));

  for (const path of tlFiles) {
    expect(textContent).toContain(path);
  }
});

test('can select a file', async ({}) => {
  firstFile = findNode(
    filesystem,
    (p, n) => !isDirectoryNode(n) && !p.includes('index.html')
  );

  if (!firstFile) {
    throw new Error('No file found');
  }

  const fileEl = await pom.fileTree.getByText(firstFile?.path);

  await fileEl.click();

  const selectedFile = await pom.selectedFile.textContent();

  expect(selectedFile).toBe(firstFile?.path);
});

test('can expand a folder to show its contents', async ({}) => {
  firstFolder = findNode(filesystem, (p, n) => isDirectoryNode(n));

  if (!firstFolder || !isDirectoryNode(firstFolder.node)) {
    throw new Error('No folder found');
  }

  const folderEl = await pom.fileTree.getByText(firstFolder?.path);

  await folderEl.click();

  const children = firstFolder.node.directory;

  const textContent = await pom.fileTree.textContent();

  visitFileTree(children, (path, node) => {
    if (!isDirectoryNode(node)) {
      expect(textContent).toContain(path);
    }
  });
});

test('can see the contents of a file', async ({}) => {
  if (!firstFile || isDirectoryNode(firstFile.node)) {
    throw new Error('No file found');
  }

  const expectedLines = String(firstFile.node.file.contents).split('\n');

  const editorLines = await pom.editor.inputValue().then(v => v.split('\n'));

  for (const line of editorLines) {
    expect(expectedLines).toContain(line);
  }
});

test('can see the preview for the playground', async ({}) => {
  // get the preview body and check that it contains the expected text

  const src = await pom.previewFrameEl.getAttribute('src');

  if (!src) {
    throw new Error('No src found for preview frame');
  }

  const frame = await pom.page.frame({ url: new RegExp(src) });

  expect(src).toContain('webcontainer.io');

  const heading = await pom.previewFrame.getByRole('heading');
  expect(heading).toBeTruthy();

  expect(await heading.textContent()).toBe('Hello World!');
});
