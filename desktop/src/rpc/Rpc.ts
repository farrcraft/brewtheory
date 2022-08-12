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

import AjaxClient from './AjaxClient';
import NativeClient from './NativeClient';
import RpcInterface from '../interfaces/rpc/Rpc';
import CertificateInterface from '../interfaces/core/Certificate';
import ClientInterface from '../interfaces/rpc/Client';

// type RpcRequestCallback = (response: request.Response, body: any) => void;
// import stream from 'stream';
// type ResponseBodyType = string|string[]|Buffer|Buffer[]|stream.Readable;

/**
 * The Rpc class is used to make RPC requests to the backend server process.
 * It only handles the outer message envelopes, transport, envelope signatures,
 * and any errors directly related to those processes.
 */
export default class Rpc implements RpcInterface {
  /**
   *
   */
  client: ClientInterface;

  /**
   * The SSL certificate created by the backend process
   */
  certificate: CertificateInterface;

  /**
   * Initialize the RPC system
   */
  constructor(cert: CertificateInterface) {
    this.certificate = cert;
    if (typeof window === 'undefined') {
      this.client = new NativeClient(cert);
    } else {
      this.client = new AjaxClient(cert);
    }
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Periodically poll the backend server until it is ready.
   * This will poll once per second for up to 10 seconds.
   */
  async waitForReady(): Promise<boolean> {
    let ok = await this.backendReady();
    if (ok === true) {
      return true;
    }

    // [FIXME] ...
    for (let ticks = 10; ticks > 0; ticks -= 1) {
      // console.log('going to sleep');
      await this.sleep(1000).then(() => {
        console.log('tick');
        ok = this.backendReady();
        if (ok === true) {
          return true;
        }
      });
    }
    return false;
  }

  /**
   * Make an RPC call to the backend to determine if it is ready.
   */
  async backendReady(): Promise<boolean> {
    // The backend generates the SSL cert on startup, so we can't enforce strict SSL yet
    // [FIXME] - we need to tell the client not to enforce strict ssl checks on this request
    const response = await this.client.request('SERVICE-READY', null);
    return response;
    /*
    response.then((result) => {
console.log('response then ' + result);
    }).catch((err) => {
console.log('response caught ' + err.code);
    });
    const promise = new Promise<boolean>((resolve) => {
      if (response === 'OK') {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch((err) => {
      if (err.code === 'ECANCELED') {
console.log('CAUGHT CANCELED!');
      }
      return false;
    });
    return promise;
    */
  }

  /**
   * Make an RPC request
   *
   * @param method The API method name
   * @param payload
   * @param callback
   */
  async request(method: string, payload: Uint8Array): Promise<string> {
    const response = await this.client.request(method, payload);
    if (response === true && this.client.lastResponse !== null) {
      return this.client.lastResponse.body;
    }
    return '';
/*
    this.sendCounter += 1;
    const signature = this.createSignature(payload);
    const options: request.OptionsWithUri = {
      uri: RPC_ENDPOINT,
      method: 'POST', // the underlying HTTP request method is always POST
      cert: this.certificate,
      ca: this.certificate,
      headers: {
        'Message-Signature': signature,
        'Request-Method': method,
        'Message-Sequence': this.sendCounter,
        'Client-Token': this.clientToken,
      },
      resolveWithFullResponse: true, // We need access to the response headers
      body: payload,
      json: false
    };

    try {
      this.lastResponse = await request(options);
    }
    catch (err) {
      throw new InternalError('Service Error', err.message);
    }
    if (this.lastResponse === null) {
      return new Uint8Array();
    }
    if (method !== 'KeyExchange') {
      this.verifyResponse(this.lastResponse);
    }
    const buffer = new ArrayBuffer(this.lastResponse.body.length * 2);
    const view = new Uint8Array(buffer);
    return view;
*/
  }

  /**
   *
   * @param str
   */
  str2ab(str: string): Uint8Array {
    /*
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    */
    const buffer = new ArrayBuffer(str.length * 2);
    const view = new Uint8Array(buffer);
    for (let i = 0, strLen = str.length; i < strLen; i += 1) {
      view[i] = str.charCodeAt(i);
    }
    return view;
    /*
    const bytes = new Uint8Array(buf);
    const dv = new DataView(bytes.buffer);
    return dv.getUint8(0);
    */
  }
}
