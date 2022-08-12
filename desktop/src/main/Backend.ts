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
    this.logger.debug('Spawning backend process...');
    this.process = childProcess.spawn('./src/resources/backend');
    if (this.process.stdout !== null) {
      this.process.stdout.on('data', (data) => this.onStdout(data));
    }
    if (this.process.stderr !== null) {
      this.process.stderr.on('data', (data) => this.onStderr(data));
    }
    this.process.on('exit', (code) => this.onExit(code));
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
      this.logger.debug('Backend service is ready');
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
