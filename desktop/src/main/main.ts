/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 */
import { app } from 'electron';
import App from './App';

const mainApp = new App();

/*
process.on('error', err => {
  mainApp.logger.debug(err);
});
*/

// We only want a single instance to be able to run at once
const gotTheLock: boolean = app.requestSingleInstanceLock();
if (!gotTheLock) {
  mainApp.logger.debug('Existing instance lock, exiting.');
  app.quit();
}

mainApp.registerHandlers();
