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
	"crypto/rand"
	"encoding/base64"

	"github.com/sirupsen/logrus"
)

// ClientToken identifies a client that can communicate with the server
// Each client has its own set of counters and signing keys
type ClientToken struct {
	Token           string
	RecvCounter     int32
	SendCounter     int32
	SignPublicKey   ed25519.PublicKey
	SignPrivateKey  ed25519.PrivateKey // Key used for signing responses
	VerifyPublicKey ed25519.PublicKey  // Key used for verifying requests
}

// NewClientToken creates a new ClientToken
func NewClientToken(logger *logrus.Logger) (*ClientToken, error) {
	client := &ClientToken{
		RecvCounter: 0,
		SendCounter: 0,
	}

	// The identifier token is just a url encoded random string
	tokenLength := 32
	rb := make([]byte, tokenLength)
	_, err := rand.Read(rb)
	if err != nil {
		logger.Warn("Error creating client token - ", err)
		return client, err
	}
	client.Token = base64.URLEncoding.EncodeToString(rb)

	client.SignPublicKey, client.SignPrivateKey, err = ed25519.GenerateKey(rand.Reader)
	if err != nil {
		logger.Warn("Error generating signing keys - ", err)
		return client, err
	}

	return client, nil
}
