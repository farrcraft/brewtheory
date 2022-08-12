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
import Client from './Client';

class AjaxClient extends Client {
  request(method: string, payload: Uint8Array | null): Promise<boolean> {
    const req = new XMLHttpRequest();
    const promise = new Promise<boolean>((resolve): void => {
      req.onreadystatechange = () => {
        try {
          if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
              // resolve(req.responseText);
              resolve(true);
            } else {
              // [FIXME] - throw
              resolve(false);
            }
          }
        } catch (err) {
          resolve(false);
          // [FIXME] - rethrow
        }
      };

      this.sendCounter += 1;

      // 3rd param = async - true/false
      req.open('POST', Endpoint.endpoint, false);

      req.setRequestHeader('Request-Method', method);
      req.setRequestHeader('Message-Sequence', this.sendCounter.toString());
      req.setRequestHeader('Client-Token', this.clientToken);

      if (payload !== null) {
        const signature = this.createSignature(payload);
        req.setRequestHeader('Message-Signature', signature);
      }

      req.send(payload);
    });
    return promise;
  }
}

export default AjaxClient;
