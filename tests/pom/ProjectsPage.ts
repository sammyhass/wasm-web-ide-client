import { Locator, Page } from '@playwright/test';

export class ProjectsPage {
  readonly page: Page;

  readonly projectCards: Locator;
  readonly newProjectButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.projectCards = page.getByTestId('project-card');
    this.newProjectButton = page.getByTestId('new-project-button');
  }
}
