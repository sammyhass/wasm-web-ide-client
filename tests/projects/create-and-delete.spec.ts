import { expect, test } from '@playwright/test';
import { getURL } from '../util';
import { loginWithTestUser } from '../util/pom/LoginRegisterPage';
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

test('create and delete a project', async ({ page }) => {
  await loginWithTestUser(page);

  const projectPom = new ProjectsPage(page);
  const name = createRandomProjectName();

  await test.step('create a new project', async () => {
    await projectPom.newProjectButton.click();

    await page.waitForURL(getURL('/projects/new'));
    expect(page.url()).toBe(getURL('/projects/new'));

    const newProjectPagePom = new NewProjectPage(page);

    await newProjectPagePom.createProject(name);

    await page.waitForLoadState('networkidle');

    await waitForProjectPage(page, name);

    const navbar = new Navbar(page);

    expect(await navbar.title.innerText()).toContain(name);
  });

  await test.step('navigate to projects page and verify project exists', async () => {
    await page.goto('/projects');

    await page.waitForLoadState('networkidle');

    expect(
      await projectPom.projectCards.getByTestId('project-title').allInnerTexts()
    ).toContain(name);
  });

  await test.step('delete the project', async () => {
    await projectPom.projectCards
      .getByTestId('project-title')
      .getByText(name)
      .click();

    await waitForProjectPage(page, name);

    const projectEditorPagePom = new ProjectEditorPage(page);

    await projectEditorPagePom.settingsButton.click();

    await projectEditorPagePom.settingsModal.deleteProject();

    await page.waitForURL(getURL('/projects'));

    await page.waitForLoadState('networkidle');

    await projectPom.projectCards
      .getByTestId('project-title')
      .getByText(name)
      .waitFor({
        state: 'hidden',
      });

    expect(
      await projectPom.projectCards.getByTestId('project-title').allInnerTexts()
    ).not.toContain(name);
  });
});
