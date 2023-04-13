import { ProjectLangT } from '@/lib/api/services/projects';
import { Page, expect, test } from '@playwright/test';
import { getURL } from '../util';
import { Navbar } from '../util/pom/Navbar';
import {
  NewProjectPage,
  createRandomProjectName,
} from '../util/pom/NewProjectPage';
import {
  ProjectEditorPage,
  waitForProjectPage,
} from '../util/pom/ProjectEditorPage';
import { ProjectsPage } from '../util/pom/ProjectsPage';
import { LoadingSpinner } from '../util/pom/Spinner';

let page: Page;
let projectsPagePom: ProjectsPage;
let projectEditorPom: ProjectEditorPage;

let newProjectName: string;

test.describe.configure({ mode: 'serial' });
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage({
    storageState: 'authedStorageState.json',
  });

  await page.goto('/projects');

  newProjectName = createRandomProjectName();
  projectsPagePom = new ProjectsPage(page);
});

const projectLanguages: ProjectLangT[] = ['AssemblyScript', 'Go'];

for (const lang of projectLanguages) {
  test(`can create a new ${lang} project`, async () => {
    await projectsPagePom.newProjectButton.click();

    await page.waitForURL(getURL('/projects/new'));

    expect(page.url()).toBe(getURL('/projects/new'));

    const newProjectPagePom = new NewProjectPage(page);

    await newProjectPagePom.createProject(newProjectName, lang);

    await waitForProjectPage(page, newProjectName);

    const navbar = new Navbar(page);
    const title = await navbar.title.innerText();
    expect(title).toContain(newProjectName);

    projectEditorPom = new ProjectEditorPage(page);
  });

  test(`can compile ${lang} to WebAssembly`, async () => {
    const spinner = new LoadingSpinner(projectEditorPom.compileButton);

    await projectEditorPom.compileButton.click();

    await spinner.waitFor();
    await spinner.waitForToBeHidden();

    const { editorConsole } = projectEditorPom;

    expect(editorConsole.hasMessage('compiled successfully')).toBeTruthy();
  });

  test(`can view WAT representation of WASM module for ${lang} project`, async () => {
    await projectEditorPom.watViewerButton.click();

    await projectEditorPom.watViewer.waitFor();

    const loading = await projectEditorPom.watViewer.getByText('Loading...');

    await loading.waitFor({ state: 'hidden' });

    const wat = await projectEditorPom.watViewer.innerText();

    expect(wat).toContain('(module');

    await projectEditorPom.page.press('body', 'Escape');

    expect(await projectEditorPom.watViewer.isVisible()).toBeFalsy();
  });

  test(`cleanup: delete the ${lang} project`, async () => {
    await projectEditorPom.settingsButton.click();

    await projectEditorPom.settingsModal.deleteProject();

    await page.waitForURL(getURL('/projects'));

    expect(page.url()).toBe(getURL('/projects'));
  });
}
