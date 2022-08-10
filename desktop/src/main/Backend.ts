import childProcess from 'child_process';

import Logger from '../core/Logger';
import BackendInterface from '../interfaces/main/Backend';

type BackendReadyCallback = () => void;

/**
 * Backend server
 */
export default class Backend implements BackendInterface {
  /**
   * The backend server process
   */
  process: childProcess.ChildProcess | null = null;

  /**
   *
   */
  logger: Logger;

  /**
   *
   */
  readyListener: BackendReadyCallback;

  /**
   *
   */
  constructor(logger: Logger, readyHandler: BackendReadyCallback) {
    this.logger = logger;
    this.readyListener = readyHandler;
  }

  /**
   *
   */
  start(): void {
    this.process = childProcess.spawn('./src/resources/backend');
    if (this.process.stdout !== null) {
      this.process.stdout.on('data', (data) => this.onStdout(data));
    }
    if (this.process.stderr !== null) {
      this.process.stderr.on('data', (data) => this.onStderr(data));
    }
    this.process.on('exit', (code) => this.onExit(code));

    // !!!! [FIXME] - this is just a short circuit until RPC in the backend is added
    this.readyListener();
  }

  /**
   *
   * @param data
   */
  onStdout(data: any): void {
    const out = data.toString();
    // This tells us that the backend is starting the server to listen for requests
    // There may still be some latency before the server is actually ready to
    // service requests.  We'll want to make actual RPC calls to the SERVICE-READY
    // endpoint after this to guarantee the backend is fully operational.
    if (out === 'SERVICE_READY\n') {
      this.readyListener();
    } else {
      this.logger.debug(out);
    }
  }

  /**
   *
   */
  onStderr(data: any): void {
    this.logger.debug(data.toString());
  }

  /**
   *
   * @param code
   */
  onExit(code: number | null): void {
    if (code !== 0 && code !== null) {
      this.logger.debug(`Child exited with code ${code}`);
    }
  }

  /**
   * Terminate the backend server process
   */
  terminate(): void {
    if (this.process) {
      this.process.kill();
    }
  }
}
