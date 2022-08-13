/*
BrewTheory
Copyright (C) 2022  Joshua Farr

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { app, ipcMain } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import path from 'path';
import Api from '../api/Api';
import AppUpdater from './AppUpdater';
import Backend from './Backend';
import Certificate from '../core/Certificate';
import Kex from '../api/endpoints/Kex';
import Logger from '../core/Logger';
import Registrar from '../api/Registrar';
import Rpc from '../rpc/Rpc';
import Window from './Window';

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
   * The API used for communicating with the backend server process
   */
  api: Api;

  /**
   * The underlying RPC mechanism through which the API communicates with the backend server process
   */
  rpc: Rpc;

  /**
   * The SSL certificate generated by the backend server process
   */
  certificate: Certificate;

  /**
   *
   */
  constructor() {
    const userDataPath: string = app.getPath('userData');
    this.logger = new Logger(userDataPath);
    this.logger.debug(`user data path is ${userDataPath}`);

    const certPath = path.join(userDataPath, 'certificate');
    this.certificate = new Certificate(certPath);

    // The RPC module talks to the backend
    this.rpc = new Rpc(this.certificate);
    // The API layer uses the RPC as its transport layer
    this.api = new Api(this.rpc);

    const registrar = new Registrar(this.api);
    registrar.register();

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
   *
   */
  onBackendStarted() {
    // The backend is only guaranteed to be in its initial service ready state
    // where its at least created the SSL certificate, but might not yet be
    // ready to service RPC requests.
    let ok = this.rpc.waitForReady(this.onBackendReady);
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

    try {
      this.certificate.load();
    } catch (err) {
      // [FIXME] - need to shutdown from here
      app.quit();
    }

    // The backend is only guaranteed to be in its initial service ready state
    // where its at least created the SSL certificate, but might not yet be
    // ready to service RPC requests.
    const ok = await this.rpc.waitForReady();
    if (ok !== true) {
      // [FIXME] - shutdown
      this.logger.error('Gave up waiting for rpc.');
      app.quit();
      return;
    }

    // [FIXME] - should use constant of some kind of endpoint name here?
    const kex = <Kex>this.api.getEndpoint('kex');
    try {
      await kex.keyExchange();
    } catch (err) {
      this.logger.error(`Key exchange failed ${err}`);
      // [FIXME] - shutdown
      app.quit();
    }

    // The bridge will make an IPC request for the backend's public key.
    // Without it, the renderer process won't be able to make backend RPC calls.
    ipcMain.on('verify-public-key', (event): void => {
      event.returnValue = this.rpc.client.verifyPublicKey;
    });

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
