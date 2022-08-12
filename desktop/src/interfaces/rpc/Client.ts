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

import Response from './Response';

/**
 *
 */
interface Client {
  /**
   * The number of messages that have been received from the backend
   */
  recvCounter: number;

  /**
   * The number of messages sent to the backend
   */
  sendCounter: number;

  /**
   * The public key used for message signing
   */
  signPublicKey: Uint8Array;

  /**
   * The private key used for message signing
   */
  signPrivateKey: Uint8Array;

  /**
   * The public key from the backend for verifying message signatures
   */
  verifyPublicKey: Uint8Array | null;

  /**
   *
   */
  clientToken: string;

  /**
   *
   */
  lastResponse: Response | null;

  /**
   *
   */
  lastError: Error | null;

  /**
   *
   * @param method
   * @param payload
   */
  request(method: string, payload: Uint8Array | null): Promise<boolean>;

  /**
   *
   * @param str
   */
  str2ab(str: string): Uint8Array;

  /**
   *
   * @param payload
   */
  createSignature(payload: Uint8Array): string;

  /**
   *
   * @param signature
   * @param payload
   */
  verifySignature(signature: string, payload: string): boolean;

  /**
   *
   * @param response
   */
  verifyResponse(response: Response): void;

  /**
   *
   */
  verifyLastResponse(): void;
}

export default Client;
