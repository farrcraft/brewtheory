// in preload scripts, we have access to limited/polyfilled node.js and electron APIs
// the remote web app will not have access, so this is safe
import { ipcRenderer, IpcRenderer } from 'electron';

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
   * The IPC entry point for the renderer to communicate with the main process
   */
  ipc: IpcRenderer;

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

    this.ipc = ipcRenderer;

    this.env = {
      port: process.env.PORT,
      nodeEnv: process.env.NODE_ENV,
    };
  }
}

export default Bridge;
