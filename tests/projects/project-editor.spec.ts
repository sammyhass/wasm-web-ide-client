import { expect, test } from '@playwright/test';
import { getURL } from '../util';
import { loginWithTestUser } from '../util/pom/LoginRegisterPage';
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

test('project editor and previews', async ({ page, browserName }) => {
  await loginWithTestUser(page);

  const projectsPagePom = new ProjectsPage(page);
  const name = createRandomProjectName();

  await test.step('create new project', async () => {
    await projectsPagePom.newProjectButton.click();

    await page.waitForURL(getURL('/projects/new'));

    expect(page.url()).toBe(getURL('/projects/new'));

    const newProjectPagePom = new NewProjectPage(page);

    await newProjectPagePom.createProject(name);

    await page.waitForLoadState('networkidle');

    await waitForProjectPage(page, name);
  });

  const projectEditorPagePom = new ProjectEditorPage(page);
  await test.step('edit project HTML', async () => {
    await projectEditorPagePom.selectFile('index.html');

    expect(await projectEditorPagePom.selectedFile.innerText()).toContain(
      'index.html'
    );

    await projectEditorPagePom.clearEditor(browserName);

    expect(await projectEditorPagePom.getEditorValue()).toBe('');

    const newContent = NEW_HTML;

    await projectEditorPagePom.editor.type(newContent);

    expect(await projectEditorPagePom.getEditorValue()).toBe(newContent);
  });

  await test.step('edit project CSS', async () => {
    await projectEditorPagePom.selectFile('styles.css');

    expect(await projectEditorPagePom.selectedFile.innerText()).toContain(
      'styles.css'
    );

    await projectEditorPagePom.clearEditor(browserName);

    expect(await projectEditorPagePom.getEditorValue()).toBe('');

    const newContent = NEW_CSS;

    await projectEditorPagePom.editor.type(newContent);

    expect(await projectEditorPagePom.getEditorValue()).toBe(newContent);
  });

  await test.step('edit project JS', async () => {
    await projectEditorPagePom.selectFile('app.js');

    expect(await projectEditorPagePom.selectedFile.innerText()).toContain(
      'app.js'
    );

    await projectEditorPagePom.clearEditor(browserName);

    expect(await projectEditorPagePom.getEditorValue()).toBe('');

    const newContent = NEW_JS;

    await projectEditorPagePom.editor.type(newContent);

    expect(await projectEditorPagePom.getEditorValue()).toBe(newContent);
  });

  await test.step('save project and view preview', async () => {
    await projectEditorPagePom.saveButton.click();

    await page.waitForLoadState('networkidle');

    await projectEditorPagePom.previewWindow.previewWindow
      .locator(`text=${H1_CONTENT}`)
      .waitFor();

    const body = await projectEditorPagePom.previewWindow.getBody();

    expect(body).toContain(NEW_HTML);

    const css = await projectEditorPagePom.previewWindow.getCSS();

    expect(css).toContain(NEW_CSS);

    const js = await projectEditorPagePom.previewWindow.getJS();

    expect(js).toContain(NEW_JS);
  });

  await test.step('check console for expected JS output', async () => {
    const consoleMessages = await (
      await projectEditorPagePom.editorConsole.getConsoleMessages()
    ).join(', ');

    expect(consoleMessages).toContain(CONSOLE_MESSAGE);
  });

  await test.step('Add JS error and ensure it appears in console', async () => {
    await projectEditorPagePom.selectFile('app.js');

    expect(await projectEditorPagePom.selectedFile.innerText()).toContain(
      'app.js'
    );

    await projectEditorPagePom.clearEditor(browserName);

    expect(await projectEditorPagePom.getEditorValue()).toBe('');

    const newContent = JS_ERROR;

    await projectEditorPagePom.editor.type(newContent);

    expect(await projectEditorPagePom.getEditorValue()).toBe(newContent);

    await projectEditorPagePom.saveButton.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const consoleMessages = await (
      await projectEditorPagePom.editorConsole.getConsoleMessages()
    ).join(', ');

    expect(consoleMessages).toContain(ERROR_MESSAGE);
  });
});
