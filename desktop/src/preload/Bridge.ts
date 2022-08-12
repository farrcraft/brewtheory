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

// in preload scripts, we have access to limited/polyfilled node.js and electron APIs
// the remote web app will not have access, so this is safe
import { ipcRenderer } from 'electron';

import BridgeInterface from '../interfaces/preload/Bridge';
import Env from '../interfaces/preload/Env';
import UserData from '../interfaces/preload/UserData';

/**
 * The preload bridge attaches to the render process' window object
 */
class Bridge implements BridgeInterface {
  /**
   * Properties from the node process environment
   */
  env: Env;

  /**
   * Properties from the electron user data
   */
  userData: UserData;

  /**
   * Initialize the preload bridge
   */
  constructor() {
    this.userData = {
      path: '', // app.getPath('userData'),
    };

    this.env = {
      port: process.env.PORT,
      nodeEnv: process.env.NODE_ENV,
    };
  }
}

export default Bridge;
