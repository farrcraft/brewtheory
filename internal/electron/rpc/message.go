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
	"github.com/farrcraft/brewtheory/internal/electron/codes"
	messages "github.com/farrcraft/brewtheory/internal/electron/proto"
)

// SetInternalError sets an error in a response header
func SetInternalError(header *messages.ResponseHeader, err error) {
	code := codes.ToInternalError(err)
	header.Code = int32(code.Code)
	header.Scope = int32(code.Scope)
	header.Status = code.Error()
}

// SetRPCError sets an rpc-specific error in a response header
func SetRPCError(header *messages.ResponseHeader, c codes.Code) {
	header.Code = int32(c)
	header.Scope = int32(codes.ScopeRPC)
	header.Status = codes.StatusSystemError
}

// NewResponseHeader creates a new response header
func NewResponseHeader() *messages.ResponseHeader {
	header := &messages.ResponseHeader{
		Code:   int32(codes.ErrorOK),
		Status: codes.StatusOK,
	}
	return header
}
