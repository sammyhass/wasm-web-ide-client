import { Locator } from "@playwright/test";

export class LoadingSpinner {
  private spinner: Locator;
  constructor(parent: Locator) {
    this.spinner = parent.getByTestId("loading-spinner");
  }

  async waitFor() {
    await this.spinner.waitFor();
  }

  async waitForToBeHidden() {
    await this.spinner.waitFor({ state: "hidden" });
  }
}
