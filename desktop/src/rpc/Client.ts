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

import base64js from 'base64-js';
import * as ed from '@noble/ed25519';

import CertificateInterface from '../interfaces/core/Certificate';
import ClientInterface from '../interfaces/rpc/Client';
import ResponseInterface from '../interfaces/rpc/Response';
import InternalError from '../core/InternalError';

/**
 *
 */
class Client implements ClientInterface {
  /**
   * The number of messages that have been received from the backend
   */
  recvCounter: number = 0;

  /**
   * The number of messages sent to the backend
   */
  sendCounter: number = 0;

  /**
   * The public key used for request message signing
   */
  signPublicKey!: Uint8Array;

  /**
   * The private key used for request message signing
   */
  signPrivateKey!: Uint8Array;

  /**
   * The backend server's public key used for verifying response messages.
   * we get this via Key Exchange (KEX)
   */
  verifyPublicKey: Uint8Array;

  /**
   *
   */
  clientToken: string;

  /**
   * The SSL certificate created by the backend process
   */
  certificate: CertificateInterface;

  /**
   *
   */
  lastResponse: ResponseInterface | null;

  /**
   *
   */
  lastError: Error | null;

  /**
   * Initialize the RPC system
   */
  constructor(cert: CertificateInterface) {
    this.createSigningKeys();

    this.certificate = cert;
    this.verifyPublicKey = new Uint8Array();
    this.clientToken = 'Empty';

    this.lastResponse = null;
    this.lastError = null;
  }

  /**
   *
   */
  async createSigningKeys(): Promise<void> {
    this.signPrivateKey = ed.utils.randomPrivateKey();
    this.signPublicKey = await ed.getPublicKey(this.signPrivateKey);
  }

  /**
   *
   * @param _method
   * @param _payload
   */
  request(_method: string, _payload: Uint8Array | null): Promise<boolean> {
    const response = new Promise<boolean>(() => {});
    return response;
  }

  /**
   * Create the signature for a request message
   *
   * @param payload The body of the request message
   */
  async createSignature(payload: string): Promise<string> {
    const rawSignature = await ed.sign(payload, this.signPrivateKey);
    const signature = Buffer.from(rawSignature).toString('hex');
    return signature;
  }

  /**
   * Verify the signature of a response message
   *
   * @param signature The response message signature
   * @param payload The message body
   */
  verifySignature(signature: string, payload: string): boolean {
    const decodedSignature = base64js.toByteArray(signature);
    const decodedPayload = base64js.toByteArray(payload);
    const ok = nacl.sign.detached.verify(
      decodedPayload,
      decodedSignature,
      this.verifyPublicKey
    );
    return ok;
  }

  /**
   * Verify that a response is valid
   *
   * @param response
   */
  verifyResponse(response: ResponseInterface): void {
    // [FIXME] - we rely on message sequence counters (not just here, but also when making
    // requests above)
    // If each process has its own rpc object (main/preload/renderer/etc), they'll each end up
    // with their own counters and nothing will be in the correct sequence to do proper message
    // verification.
    // Maybe instead we should have the backend support registering multiple clients, so each
    // one gets its own key exchange and own distinct set of counters - each client then gets
    // its own unique token as part of the key exchange which is passed along in message headers
    // to identify it and bind it to the correct keys & counters.
    this.recvCounter += 1;
    if (!('message-sequence' in response.headers)) {
      throw new InternalError('Transport Error', 'Missing sequence header');
    }
    const sequence = parseInt(
      response.headers['message-sequence'] as string,
      10
    );
    if (sequence !== this.recvCounter) {
      throw new InternalError('Transport Error', 'Unexpected sequence');
    }

    if (!('notekeeper-message-signature' in response.headers)) {
      throw new InternalError('Transport Error', 'Missing message signature');
    }

    const signature = response.headers['message-signature'] as string;
    if (!this.verifySignature(signature, response.body.toString())) {
      throw new InternalError(
        'Transport Error',
        'Failed to verify response signature'
      );
    }
  }

  /**
   *
   */
  verifyLastResponse(): void {
    if (this.lastResponse !== null) {
      this.verifyResponse(this.lastResponse);
    }
  }

  /**
   *
   * @param str
   */
  str2ab(str: string): Uint8Array {
    const buffer = new ArrayBuffer(str.length * 2);
    const view = new Uint8Array(buffer);
    return view;
  }
}

export default Client;
