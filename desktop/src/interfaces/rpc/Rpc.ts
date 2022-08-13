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

import Client from './Client';
import CertificateInterface from '../core/Certificate';

/**
 * The interface for making RPC requests to the backend process
 */
interface Rpc {
  /**
   *
   */
  client: Client;

  /**
   * The SSL certificate created by the backend process
   */
  certificate: CertificateInterface;

  /**
   *
   * @param method
   * @param payload
   */
  request(method: string, payload: Uint8Array): Promise<string>;
}

export default Rpc;
