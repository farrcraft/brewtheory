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

package handler

import (
	"encoding/base64"

	"google.golang.org/protobuf/proto"

	"github.com/farrcraft/brewtheory/internal/electron/codes"
	messages "github.com/farrcraft/brewtheory/internal/electron/proto"
	"github.com/farrcraft/brewtheory/internal/electron/rpc"
)

// KeyExchange performs a key exchange between client & server
func KeyExchange(server *rpc.Server, message []byte, context *rpc.RequestContext) (proto.Message, error) {
	response := &messages.KeyExchangeResponse{
		Header: rpc.NewResponseHeader(),
	}

	request := messages.KeyExchangeRequest{}
	decodedMessage, err := base64.URLEncoding.DecodeString(string(message))
	if err != nil {
		server.Logger.Warn("Error decoding message - ", err)
		rpc.SetRPCError(response.Header, codes.ErrorDecode)
		return response, nil
	}
	err = proto.Unmarshal(decodedMessage, &request)
	if err != nil {
		server.Logger.Warn("Error unmarshaling message - ", err)
		rpc.SetRPCError(response.Header, codes.ErrorDecode)
		return response, nil
	}

	// create a new client token
	context.Token, err = rpc.NewClientToken(server.Logger)
	if err != nil {
		rpc.SetRPCError(response.Header, codes.ErrorCrypto)
		return response, nil
	}
	// [FIXME] - assert request key length matches our target array size

	// client sent its own public key so we can verify requests it sends us later
	// this is a bit weak sauce wrt security since signature & verification key
	// are contained in the same message body, but it does give us assurance
	// that we at least have a functional verification key.
	// context.Token.VerifyPublicKey = new([ed25519.PublicKeySize]byte)
	context.Token.VerifyPublicKey = make([]byte, len(request.PublicKey))
	copy(context.Token.VerifyPublicKey, request.PublicKey)

	// send our own public key so client can verify our responses
	response.PublicKey = context.Token.SignPublicKey[:]
	// the client will also need to keep track of its identifying token for future requests
	response.Token = context.Token.Token

	// reset sequence counters
	context.Token.SendCounter = 0
	context.Token.RecvCounter = 1

	server.Clients[context.Token.Token] = context.Token

	return response, nil
}
