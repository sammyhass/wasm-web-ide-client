import { faker } from '@faker-js/faker';
import { Locator, Page } from '@playwright/test';

export class NewProjectPage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.getByTestId('project-name-input');
    this.submitButton = page.getByTestId('create-project-button');
  }

  async createProject(name: string) {
    await this.nameInput.fill(name);
    await this.submitButton.click();
  }
}

export const createRandomProjectName = (): string =>
  faker.commerce.productName();
