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

import Endpoint from '../Endpoint';
import EndpointInterface from '../../interfaces/api/Endpoint';
import InternalError from '../../core/InternalError';
import * as commonProto from '../../proto/common';
import * as kexProto from '../../proto/kex';

/**
 *
 */
class Kex extends Endpoint implements EndpointInterface {
  /**
   *
   */
  constructor() {
    super();
    this.setName('kex');
  }

  /**
   *
   */
  async keyExchange(): Promise<void> {
    if (this.rpc === null) {
      throw new InternalError('Service Error', 'RPC Unavailable');
    }
    const message = new kexProto.brewtheory.KeyExchangeRequest();
    const messageHeader = new commonProto.brewtheory.RequestHeader();
    messageHeader.method = 'keyExchange';
    message.header = messageHeader;
    message.publicKey = this.rpc.client.signPublicKey;

    const payload = message.serializeBinary();
    const responseBody = await this.rpc.request('KeyExchange', payload);

    const responseMessage =
      kexProto.brewtheory.KeyExchangeResponse.deserializeBinary(
        Uint8Array.from(Buffer.from(responseBody, 'hex'))
      );

    this.rpc.client.verifyPublicKey = responseMessage.publicKey;
    this.rpc.client.clientToken = responseMessage.token;

    // responses would normally be verified directly by the rpc call, but it has to
    // be deferred in the case of key exchange - this throws on verification failure
    await this.rpc.client.verifyLastResponse();
  }
}

export default Kex;
