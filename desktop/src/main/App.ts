import { app } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import Logger from '../core/Logger';
import Backend from './Backend';
import Window from './Window';
import AppUpdater from './AppUpdater';

class App {
  /**
   *
   */
  logger: Logger;

  /**
   * The window where the renderer process lives
   */
  window: Window;

  /**
   * The backend server process
   */
  backend: Backend;

  /**
   *
   */
  constructor() {
    const userDataPath: string = app.getPath('userData');
    this.logger = new Logger(userDataPath);

    this.backend = new Backend(this.logger, () => this.onBackendReady());
    this.window = new Window();
  }

  /**
   *
   */
  onSecondInstance(): void {
    if (!this.window || !this.window.window) {
      return;
    }
    if (this.window.window.isMinimized()) {
      this.window.window.restore();
    }
    this.window.window.focus();
  }

  /**
   *
   */
  onWillQuit(): void {
    this.backend.terminate();
  }

  /**
   * Setup all of the event handlers for the electron app
   */
  registerHandlers(): void {
    app.on('second-instance', (/* event, commandLine, workingDirectory */) =>
      this.onSecondInstance());

    // all windows have been closed & app is about to quit
    app.on('will-quit', () => this.onWillQuit());

    // Security-related configuration
    // See: https://electronjs.org/docs/tutorial/security
    // app.on('web-contents-created', (event, contents) => this.onWebContentsCreated(event, contents));

    app.on('window-all-closed', () => this.onWindowAllClosed());

    app.on('ready', () => this.onReady());
  }

  /**
   * Once the backend is ready, we create the main browser window
   */
  async onBackendReady(): Promise<void> {
    const installExtensions = async (): Promise<void> => {
      if (process.env.NODE_ENV === 'development') {
        return installExtension([REACT_DEVELOPER_TOOLS.id])
          .then((name) => console.log(`Added Extension:  ${name}`))
          .catch((err) => console.log('An error occurred: ', err));
      }
    };

    await installExtensions();

    // create the window
    this.window.create(800, 600, 0, 0);

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
  }

  /**
   * Once the Electron app is in a ready state, we are ready to start the backend
   * process and open the main browser window.
   */
  onReady(): void {
    // Start the backend process - it will call the ready listener when it is ready
    // We will pick back up again in onBackendReady().
    this.backend.start();
  }

  /**
   *
   */
  async onWindowAllClosed(): Promise<void> {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

export default App;
