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

package rpc

import (
	"crypto/ed25519"
	"encoding/base64"
)

// CreateSignature creates a signature for a response body
func (rpc *Server) CreateSignature(response []byte, context *RequestContext) string {
	signature := ed25519.Sign(context.Token.SignPrivateKey, response)

	sig := base64.StdEncoding.EncodeToString(signature[:])
	return sig
}

// VerifyRequest uses the client's public key to verify the message signature
func (rpc *Server) VerifyRequest(message []byte, sig []byte, context *RequestContext) bool {
	if context.Token == nil {
		rpc.Logger.Warn("Request context missing Token when verifying request")
		return false
	}
	ok := ed25519.Verify(context.Token.VerifyPublicKey, message, sig)
	if !ok {
		rpc.Logger.Warn("Request payload signature could not be verified. key [", context.Token.VerifyPublicKey[:], "] message [", message, "] signature")
		return false
	}
	return true
}
