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

import * as https from 'https';
import * as http from 'http';
import * as ed from '@noble/ed25519';
import Endpoint from './Endpoint';
import Response from './Response';
import Client from './Client';

/**
 * This is a native request using the built-in nodejs modules
 */
class NativeClient extends Client {
  /**
   * Make an API request
   * The direct response is not returned, but can be accessed from the client
   * after the returned promise has been fulfilled.
   *
   * @param method
   * @param payload
   * @returns a promise indicating whether the request was successful or not
   */
  async request(method: string, payload: Uint8Array | null): Promise<boolean> {
    this.sendCounter += 1;
    const options: https.RequestOptions = {
      hostname: Endpoint.host,
      port: Endpoint.port,
      path: Endpoint.path,
      method: 'POST',
    };
    // console.log(`requesting ${method}`);
    const certBuffer = this.certificate.getBuffer();
    if (certBuffer !== undefined) {
      options.cert = certBuffer;
      options.ca = certBuffer;
    } else {
      // we haven't loaded the cert yet, so ignore the ssl errors on this request
      options.rejectUnauthorized = false;
    }
    options.headers = {
      'Request-Method': method,
      'Message-Sequence': this.sendCounter,
      'Client-Token': this.clientToken,
    };
    let requestBody = '';
    if (payload !== null) {
      // hex encode the payload so we don't have to worry about the protobuf wire format getting mangled during transit.
      requestBody = ed.utils.bytesToHex(payload);
      const signature = await this.createSignature(requestBody);
      options.headers['Message-Signature'] = signature;
      options.headers['Content-Type'] = 'application/octet-stream';
    }

    const promise = new Promise<boolean>((resolve): void => {
      const req = https.request(
        options,
        (response: http.IncomingMessage): void => {
          response.setEncoding('utf8');
          const body: Array<string> = [];
          // response.statusCode
          response.on('data', (chunk) => {
            body.push(chunk);
          });
          response.on('end', () => {
            this.lastResponse = new Response();
            this.lastResponse.body = body.join('');
            this.lastResponse.headers = response.headers;
            if (response.statusCode === 200) {
              this.lastError = null;
              resolve(true);
            } else {
              resolve(false);
              // [FIXME] - handle error
            }
          });
        }
      );
      req.on('error', (err) => {
        this.lastError = err;
        resolve(false);
      });
      req.write(requestBody);
      req.end();
    });
    return promise;
  }
}

export default NativeClient;
