import { Locator, Page } from '@playwright/test';
import { Navbar } from '../Navbar';
import { LoadingSpinner } from '../Spinner';
import { EditorConsole } from './EditorConsole';
import { PreviewWindow } from './PreviewWindow';
import { SettingsModal } from './SettingsModal';

export class ProjectEditorPage {
  readonly page: Page;

  readonly settingsModal: SettingsModal;
  readonly settingsButton: Locator;

  readonly compileButton: Locator;
  readonly saveButton: Locator;

  readonly fileTree: Locator;

  readonly selectedFile: Locator;

  readonly editorWindow: Locator;
  readonly editor: Locator;

  readonly previewWindow: PreviewWindow;
  readonly editorConsole: EditorConsole;

  constructor(page: Page) {
    this.page = page;

    this.settingsModal = new SettingsModal(page);

    this.settingsButton = page.getByTestId('project-settings-button');

    this.compileButton = page.getByTestId('compile-project-button');

    this.saveButton = page.getByTestId('save-project-button');

    this.fileTree = page.getByTestId('file-tree');

    this.selectedFile = page.getByTestId('selected-file');

    this.editorWindow = page.getByTestId('editor-window');

    this.editor = this.editorWindow.locator('.inputarea');

    this.previewWindow = new PreviewWindow(page);

    this.editorConsole = new EditorConsole(page);
  }

  async waitForEditor() {
    await this.editor.waitFor();
  }

  async selectFile(fileName: string) {
    const ext = fileName.split('.').pop();
    await this.fileTree
      .locator(`[data-testid="file-tree-item-${ext}"]`)
      .click();
  }

  async clearEditor(browserName: string) {
    await this.editor.focus();
    if (browserName === 'webkit') {
      await this.editor.press('Meta+A');
    } else {
      await this.editor.press('Control+A');
    }

    await this.editor.press('Backspace');
  }

  async getEditorValue() {
    return await this.editor.inputValue();
  }

  async save() {
    const spinner = new LoadingSpinner(this.saveButton);

    await this.saveButton.click();
    await spinner.waitFor();

    await this.page.waitForLoadState('networkidle');

    await spinner.waitForToBeHidden();

    await this.previewWindow.previewBody.waitFor();
  }
}

export async function waitForProjectPage(page: Page, title: string) {
  const navbar = new Navbar(page);
  const regex =
    /\/projects\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;

  await page.waitForURL(url => regex.test(url.href));
  await page.waitForLoadState('networkidle');

  await navbar.title.locator(`text=${title}`).waitFor();
}
