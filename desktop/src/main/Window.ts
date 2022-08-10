import { BrowserWindow } from 'electron';
import path from 'path';

import WindowInterface from '../interfaces/main/Window';
import MenuBuilder from './MenuBuilder';

export default class Window implements WindowInterface {
  window: BrowserWindow | undefined;

  /**
   * Create the renderer process' browser window
   *
   * @param width
   * @param height
   * @param x
   * @param y
   */
  create(width: number, height: number, x: number, y: number): void {
    let preloadScript = 'preload.prod.js';
    if (process.env.NODE_ENV === 'development') {
      preloadScript = 'preload.dev.js';
    }

    const options: Electron.BrowserWindowConstructorOptions = {
      webPreferences: {
        preload: path.join(__dirname, preloadScript),
      },
      show: false,
      width,
      height,
    };
    if (x >= 0) {
      options.x = x;
    }
    if (y >= 0) {
      options.y = y;
    }
    this.window = new BrowserWindow(options);

    this.window.loadURL(`file://${__dirname}/app.html`);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    this.window.webContents.on('did-finish-load', () => {
      if (!this.window) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.window.minimize();
      } else {
        this.window.show();
        this.window.focus();
      }
    });

    this.window.on('closed', () => {
      // Terminate backend process
      // backend.kill('SIGINT');
      this.window = undefined;
    });

    const menuBuilder = new MenuBuilder(this.window);
    menuBuilder.buildMenu();
  }
}
