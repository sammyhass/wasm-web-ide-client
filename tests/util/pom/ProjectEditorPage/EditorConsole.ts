import { Locator, Page } from "@playwright/test";

export class EditorConsole {
  readonly consoleContainer: Locator;
  readonly consoleMessages: Locator;

  constructor(page: Page) {
    this.consoleContainer = page.getByTestId("console-messages");
    this.consoleMessages = this.consoleContainer.getByTestId("console-message");
  }

  async getConsoleMessages() {
    return await this.consoleMessages.allInnerTexts();
  }

  async getConsoleMessageCount() {
    return await this.consoleMessages.count();
  }

  async hasMessage(message: string) {
    const joinedMessages = (await this.getConsoleMessages()).join("");

    return joinedMessages.includes(message);
  }
}
