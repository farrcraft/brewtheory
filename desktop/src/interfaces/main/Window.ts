import { BrowserWindow } from 'electron';

/**
 *
 */
interface Window {
  /**
   *
   */
  window: BrowserWindow | undefined;

  /**
   *
   * @param width
   * @param height
   * @param x
   * @param y
   */
  create(width: number, height: number, x: number, y: number): void;
}

export default Window;
