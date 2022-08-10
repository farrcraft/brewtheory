import { IpcRenderer } from 'electron';

import Env from './Env';
import UserData from './UserData';

/**
 * The bridge between the main and renderer process established via preload
 */
interface Bridge {
  /**
   * Node process properties
   */
  env: Env;

  /**
   * The electron IPC mechanism for the renderer process
   */
  ipc: IpcRenderer;

  /**
   * Electron user data properties
   */
  userData: UserData;
}

export default Bridge;
