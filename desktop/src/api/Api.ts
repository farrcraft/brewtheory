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

import ApiInterface from '../interfaces/api/Api';
import EndpointInterface from '../interfaces/api/Endpoint';
import EndpointHashMap from '../interfaces/api/EndpointHashMap';
import RpcInterface from '../interfaces/rpc/Rpc';

/**
 *
 */
class Api implements ApiInterface {
  /**
   *
   */
  endpoints: EndpointHashMap;

  /**
   *
   */
  rpc: RpcInterface;

  /**
   *
   * @param rpc
   */
  constructor(rpc: RpcInterface) {
    this.rpc = rpc;
    this.endpoints = {};
  }

  /**
   *
   * @param provider
   */
  registerProvider(provider: EndpointInterface): void {
    this.endpoints[provider.getName()] = provider;
    provider.setRpc(this.rpc);
  }

  /**
   *
   * @param endpoint
   */
  getEndpoint(endpoint: string): EndpointInterface {
    return this.endpoints[endpoint];
  }
}

export default Api;
