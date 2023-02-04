import { expect, Page, test } from '@playwright/test';
import { getURL } from '../util';
import { Navbar } from '../util/pom/Navbar';
import {
  createRandomProjectName,
  NewProjectPage,
} from '../util/pom/NewProjectPage';
import {
  ProjectEditorPage,
  waitForProjectPage,
} from '../util/pom/ProjectEditorPage';
import { ProjectsPage } from '../util/pom/ProjectsPage';

const H1_CONTENT = 'Hello WASM!';
const NEW_HTML = `<h1>${H1_CONTENT}</h1>`;

const NEW_CSS = 'h1 { color: red; }';

const CONSOLE_MESSAGE = 'Hello WASM!';
const ERROR_MESSAGE = 'Uncaught SyntaxError: Unexpected identifier';
const JS_ERROR = `throw new Error('${ERROR_MESSAGE}');`;
const NEW_JS = `console.log('${CONSOLE_MESSAGE}');`;

let page: Page;
let browserName: string;

let projectsPagePom: ProjectsPage;
let projectEditorPom: ProjectEditorPage;

let newProjectName: string;

test.describe.configure({ mode: 'serial' });
test.beforeAll(async ({ browser, browserName: _browserName }) => {
  page = await browser.newPage({
    storageState: 'authedStorageState.json',
  });

  await page.goto('/projects');

  newProjectName = createRandomProjectName();
  projectsPagePom = new ProjectsPage(page);

  browserName = _browserName;
});

test('can create a new project', async () => {
  await projectsPagePom.newProjectButton.click();

  await page.waitForURL(getURL('/projects/new'));

  expect(page.url()).toBe(getURL('/projects/new'));

  const newProjectPagePom = new NewProjectPage(page);

  await newProjectPagePom.createProject(newProjectName);

  await page.waitForLoadState('networkidle');

  await waitForProjectPage(page, newProjectName);

  const navbar = new Navbar(page);
  const title = await navbar.title.innerText();
  expect(title).toContain(newProjectName);

  projectEditorPom = new ProjectEditorPage(page);
});

test('can edit the project HTML', async () => {
  await projectEditorPom.selectFile('index.html');

  expect(await projectEditorPom.selectedFile.innerText()).toContain(
    'index.html'
  );

  await projectEditorPom.clearEditor(browserName);

  expect(await projectEditorPom.getEditorValue()).toBe('');

  const newContent = NEW_HTML;

  await projectEditorPom.editor.type(newContent);

  expect(await projectEditorPom.getEditorValue()).toBe(newContent);
});

test('can edit the project CSS', async () => {
  await projectEditorPom.selectFile('styles.css');

  expect(await projectEditorPom.selectedFile.innerText()).toContain(
    'styles.css'
  );

  await projectEditorPom.clearEditor(browserName);

  expect(await projectEditorPom.getEditorValue()).toBe('');

  const newContent = NEW_CSS;

  await projectEditorPom.editor.type(newContent);

  expect(await projectEditorPom.getEditorValue()).toBe(newContent);
});

test('can edit the project JavaScript', async () => {
  await projectEditorPom.selectFile('app.js');

  expect(await projectEditorPom.selectedFile.innerText()).toContain('app.js');

  await projectEditorPom.clearEditor(browserName);

  expect(await projectEditorPom.getEditorValue()).toBe('');

  const newContent = NEW_JS;

  await projectEditorPom.editor.type(newContent);

  expect(await projectEditorPom.getEditorValue()).toBe(newContent);
});

test('can save the project and see changes in preview window', async () => {
  await projectEditorPom.save();

  await projectEditorPom.previewWindow.previewWindow
    .locator(`text=${H1_CONTENT}`)
    .waitFor();

  const body = await projectEditorPom.previewWindow.getBody();

  expect(body).toContain(NEW_HTML);

  const css = await projectEditorPom.previewWindow.getCSS();

  expect(css).toContain(NEW_CSS);

  const js = await projectEditorPom.previewWindow.getJS();

  expect(js).toContain(NEW_JS);
});

test('can see expected JS output in the console', async () => {
  const consoleMessages = await (
    await projectEditorPom.editorConsole.getConsoleMessages()
  ).join(', ');

  expect(consoleMessages).toContain(CONSOLE_MESSAGE);
});

test('can view JS error in the console', async () => {
  await projectEditorPom.selectFile('app.js');

  expect(await projectEditorPom.selectedFile.innerText()).toContain('app.js');

  await projectEditorPom.clearEditor(browserName);

  expect(await projectEditorPom.getEditorValue()).toBe('');

  const newContent = JS_ERROR;

  await projectEditorPom.editor.type(newContent);

  expect(await projectEditorPom.getEditorValue()).toBe(newContent);

  await projectEditorPom.save();

  const consoleMessages = await (
    await projectEditorPom.editorConsole.getConsoleMessages()
  ).join(', ');

  expect(consoleMessages).toContain(ERROR_MESSAGE);
});

test('can delete project', async () => {
  await projectEditorPom.settingsButton.click();

  await projectEditorPom.settingsModal.deleteProject();

  await page.waitForLoadState('networkidle');
});
