import { FrameLocator, Locator, Page } from '@playwright/test';
import { EditorConsole } from './ProjectEditorPage/EditorConsole';

export class PlaygroundPage {
  readonly page: Page;

  readonly toolbar: Locator;

  readonly selectedFile: Locator;

  readonly fileTree: Locator;

  readonly previewFrameEl: Locator;
  readonly previewFrame: FrameLocator;

  readonly editorWindow: Locator;
  readonly editor: Locator;

  readonly consoleWindow: EditorConsole;

  constructor(page: Page) {
    this.page = page;

    this.toolbar = page.getByTestId('toolbar');

    const previewTestId = 'preview-window';
    this.previewFrameEl = page.getByTestId(previewTestId);
    this.previewFrame = page.frameLocator(`[data-testid="${previewTestId}"]`);

    this.editorWindow = page.getByTestId('editor-window');
    this.editor = this.editorWindow.locator('.inputarea');

    this.fileTree = page.getByTestId('file-tree');

    this.selectedFile = page.getByTestId('selected-file');

    this.consoleWindow = new EditorConsole(page);
  }
}
