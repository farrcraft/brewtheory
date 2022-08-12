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
import RegistrarInterface from '../interfaces/api/Registrar';
import Kex from './endpoints/Kex';

/**
 *
 */
class Registrar implements RegistrarInterface {
  api: ApiInterface;

  constructor(api: ApiInterface) {
    this.api = api;
  }

  setApi(api: ApiInterface): void {
    this.api = api;
  }

  /**
   *
   * @param api
   */
  register(): void {
    this.api.registerProvider(new Kex());
  }
}

export default Registrar;
