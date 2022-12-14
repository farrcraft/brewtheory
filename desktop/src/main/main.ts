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
