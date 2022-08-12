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

import fs from 'fs';

import CertificateInterface from '../interfaces/core/Certificate';
import InternalError from './InternalError';

// See: https://dev.to/jdbar/the-problem-with-handling-node-js-errors-in-typescript-and-the-workaround-m64
function isError(error: any): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

/**
 * Handle loading the backend SSL certificate
 * The certificate can only be loaded after the backend reaches its initial service
 * ready state.  Additionally, it can only be loaded from either the main or preload
 * processes.
 */
class Certificate implements CertificateInterface {
  /**
   *
   */
  certificate: Buffer | undefined;

  /**
   *
   */
  path: string;

  /**
   *
   * @param certPath
   */
  constructor(certPath: string) {
    this.path = certPath;
  }

  /**
   * Load the SSL certificate created by the backend process
   */
  load(): void {
    try {
      this.certificate = fs.readFileSync(this.path);
    } catch (err: unknown) {
      let msg = 'Unknown certificate error';
      if (typeof err === 'string') {
        msg = err;
      } else if (isError(err) && err instanceof Error) {
        msg = err.message;
        if (err.code === 'ENOENT') {
          msg = 'Certificate file does not exist';
        } else if (err.code === 'EACCESS') {
          msg = 'Certificate file permission denied';
        }
      }
      throw new InternalError('Certificate Error', msg);
    }
  }
}

export default Certificate;
