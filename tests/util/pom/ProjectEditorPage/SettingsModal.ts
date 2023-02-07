import { Locator, Page } from '@playwright/test';

export class SettingsModal {
  readonly modal: Locator;
  readonly closeButton: Locator;

  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;

  readonly renameButton: Locator;
  readonly renameInput: Locator;

  constructor(page: Page) {
    this.modal = page.locator('[data-testid="project-settings"]');
    this.deleteButton = this.modal.locator(
      '[data-testid="delete-project-button"]'
    );
    this.confirmDeleteButton = this.modal.locator(
      '[data-testid="confirm-delete-project-button"]'
    );

    this.closeButton = this.modal.locator('[data-testid="close-settings"]');

    this.renameButton = this.modal.getByTestId('rename-project-button');

    this.renameInput = this.modal.getByTestId('rename-project-input');
  }

  async deleteProject() {
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
  }

  async renameProject(name: string) {
    await this.renameInput.fill(name);
    await this.renameButton.click();
  }
}
