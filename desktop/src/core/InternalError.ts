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

import InternalErrorInterface from '../interfaces/core/InternalError';

/**
 *
 */
class InternalError extends Error implements InternalErrorInterface {
  /**
   *
   * @param title
   * @param msg
   */
  constructor(title: string, msg: string) {
    super(msg);
    this.setName(title);
  }

  setName(title: string): void {
    this.name = title;
  }
}

export default InternalError;
