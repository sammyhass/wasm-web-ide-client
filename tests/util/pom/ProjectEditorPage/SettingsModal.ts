import { Locator, Page } from '@playwright/test';

export class SettingsModal {
  readonly modal: Locator;
  readonly closeButton: Locator;

  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.modal = page.locator('[data-testid="project-settings"]');
    this.deleteButton = this.modal.locator(
      '[data-testid="delete-project-button"]'
    );
    this.confirmDeleteButton = this.modal.locator(
      '[data-testid="confirm-delete-project-button"]'
    );

    this.closeButton = this.modal.locator('[data-testid="close-settings"]');
  }

  async deleteProject() {
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
  }
}
