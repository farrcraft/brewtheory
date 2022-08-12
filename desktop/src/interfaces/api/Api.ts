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

import Endpoint from './Endpoint';
import EndpointHashMap from './EndpointHashMap';
import Rpc from '../rpc/Rpc';

/**
 *
 */
interface Api {
  /**
   *
   */
  endpoints: EndpointHashMap | undefined;

  /**
   *
   */
  rpc: Rpc;

  /**
   *
   * @param provider
   */
  registerProvider(provider: Endpoint): void;

  /**
   *
   * @param endpoint
   */
  getEndpoint(endpoint: string): Endpoint;
}

export default Api;
