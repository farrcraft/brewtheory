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

package codes

import (
	"fmt"
	"strconv"
)

// Code is the error code type
type Code int32

// Scope of an error code
type Scope int32

// ErrorType is the type of error
type ErrorType int32

// InternalError is a custom error type
type InternalError struct {
	Scope   Scope
	Code    Code
	Type    ErrorType
	Message string
}

// These are the status types that can be passed to the front end
const (
	StatusOK          = "OK"
	StatusSystemError = "SYSTEM_ERROR"
	StatusAppError    = "APP_ERROR"
)

// Valid error types
// System errors are internal exception states
// Application errors are not exceptional and can be encountered during normal application interactions.
// They can be triggered by e.g., trying to perform an action in the wrong context or providing invalid data.
// E.g., logging in with the wrong username or password would be an application-level error and not an internal system error.
const (
	TypeOK ErrorType = iota
	TypeSystem
	TypeApplication
)

// Valid error scopes
const (
	ScopeGeneral Scope = iota
	ScopeAPI
	ScopeDB
	ScopeRPC
)

// These are the error codes that can be passed to the front end
const (
	ErrorOK Code = iota
	ErrorUnknown
	ErrorInternalEscape // This means a non-internal error tried to escape the RPC boundary

	ErrorUnauthorized
	ErrorInvalidType
	ErrorMarshal
	ErrorOpenKey
	ErrorEncrypt
	ErrorDecrypt
	ErrorCrypto
	ErrorWriteBucket
	ErrorSave
	ErrorBucketMissing
	ErrorDecode
	ErrorDeriveKey
	ErrorConvertID
	ErrorLookup
	ErrorLoad
	ErrorLoadAll
	ErrorDelete
	ErrorCreate
	ErrorRecordMissing
)

// String converts error code to a string
func (e Code) String() string {
	s := strconv.Itoa(int(e))
	return s
}

func (scope Scope) String() string {
	s := strconv.Itoa(int(scope))
	return s
}

// New creates a new InternalError
func New(scope Scope, code Code) *InternalError {
	msg := messageFromCode(scope, code)
	err := &InternalError{
		Type:    TypeSystem,
		Code:    code,
		Scope:   scope,
		Message: msg,
	}
	return err
}

// Error satisfies the error type interface
func (error *InternalError) Error() string {
	return error.Message
}

// IsInternalError tests to see if this is an internal error or a native error type
func IsInternalError(err error) bool {
	if _, ok := err.(*InternalError); ok {
		return true
	}
	return false
}

// ToInternalError converts an error to an InternalError
func ToInternalError(err error) *InternalError {
	if internal, ok := err.(*InternalError); ok {
		return internal
	}
	code := New(ScopeGeneral, ErrorInternalEscape)
	return code
}

func messageFromScope(scope Scope) string {
	msgScope := "unknown scope"
	switch scope {
	case ScopeAPI:
		msgScope = "api"
	case ScopeDB:
		msgScope = "db"
	case ScopeGeneral:
		msgScope = "general"
	default:
		msgScope = "default"
	}
	return msgScope
}

func messageFromCode(scope Scope, code Code) string {
	msgScope := messageFromScope(scope)
	msg := defaultMessageFromCode(code)
	errorString := fmt.Sprint(msgScope, " - ", msg)
	return errorString
}

func defaultMessageFromCode(code Code) string {
	msg := "unknown internal error"
	switch code {
	case ErrorUnknown:
		// default value
	case ErrorInternalEscape:
		msg = "internal error escape"
	case ErrorUnauthorized:
		msg = "error unauthorized"
	case ErrorInvalidType:
		msg = "error invalid type"
	case ErrorMarshal:
		msg = "error marshaling"
	case ErrorOpenKey:
		msg = "error retrieving key"
	case ErrorEncrypt:
		msg = "error encrypting"
	case ErrorDecrypt:
		msg = "error decrypting"
	case ErrorCrypto:
		msg = "cryptography error"
	case ErrorWriteBucket:
		msg = "error writing to bucket"
	case ErrorSave:
		msg = "error saving"
	case ErrorBucketMissing:
		msg = "error bucket missing"
	case ErrorDecode:
		msg = "error decoding"
	case ErrorDeriveKey:
		msg = "error deriving key"
	case ErrorConvertID:
		msg = "error converting id"
	case ErrorLookup:
		msg = "error looking up"
	case ErrorLoad:
		msg = "error loading"
	case ErrorLoadAll:
		msg = "error loading all"
	case ErrorDelete:
		msg = "error deleting"
	case ErrorCreate:
		msg = "error creating"
	case ErrorRecordMissing:
		msg = "error missing record"
	}

	return msg
}
