import { ProjectLangT } from '@/lib/api/services/projects';
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

  async createProject(name: string, lang: ProjectLangT = 'Go') {
    await this.nameInput.fill(name);
    await this.selectLang(lang);
    await this.submitButton.click();
  }

  async selectLang(lang: ProjectLangT) {
    await this.page.getByTestId(`lang-item-${lang}`).click();
  }
}

export const createRandomProjectName = (): string =>
  `${faker.commerce.productName()}_${faker.random.numeric(3)}`;
