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
import messagesKex from '../../proto/kex_pb';

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
  keyExchange(): void {
    if (this.rpc === null) {
      throw new InternalError('Service Error', 'RPC Unavailable');
    }
    const message = new messagesKex.KeyExchangeRequest();
    message.setPublickey(this.rpc.client.signPublicKey);
    const payload = message.serializeBinary();

    const response = this.rpc.request('KeyExchange', payload);
    response.then((body) => {
      if (this.rpc === null) {
        throw new InternalError('Service Error', 'RPC Unavailable');
      }
      const responseMessage = messagesKex.KeyExchangeResponse.deserializeBinary(
        this.rpc.str2ab(body)
      );

      let key = responseMessage.getPublickey();
      if (typeof key === 'string') {
        // [FIXME] - need a better place for this method to live (it's in Request too)
        key = this.rpc.str2ab(key);
      }
      this.rpc.client.verifyPublicKey = key;
      this.rpc.client.clientToken = responseMessage.getToken();

      // responses would normally be verified directly by the rpc call, but it has to
      // be deferred in the case of key exchange - this throws on verification failure
      this.rpc.client.verifyLastResponse();
    });
  }
}

export default Kex;
