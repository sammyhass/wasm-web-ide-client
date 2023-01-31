import { FrameLocator, Locator, Page } from '@playwright/test';

export class PreviewWindow {
  readonly previewWindow: FrameLocator;
  readonly previewBody: Locator;
  readonly previewCss: Locator;
  readonly previewJs: Locator;

  constructor(page: Page) {
    this.previewWindow = page.frameLocator('#previewWindow iframe');

    this.previewBody = this.previewWindow.getByTestId('preview-body');
    this.previewCss = this.previewWindow.getByTestId('preview-css');
    this.previewJs = this.previewWindow.getByTestId('preview-script');
  }

  async getBody() {
    return await this.previewBody.innerHTML();
  }

  async getCSS() {
    return await this.previewCss.innerText();
  }

  async getJS() {
    return await this.previewJs.innerText();
  }
}
