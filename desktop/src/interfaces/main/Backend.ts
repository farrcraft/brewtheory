import childProcess from 'child_process';

/**
 *
 */
interface Backend {
  /**
   *
   */
  process: childProcess.ChildProcess | null;

  /**
   *
   */
  start(): void;

  /**
   *
   */
  terminate(): void;
}

export default Backend;
