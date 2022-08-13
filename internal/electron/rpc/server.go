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
	"crypto/tls"
	"encoding/base64"
	"encoding/hex"
	"io"
	"log"
	"net"
	"net/http"
	"strconv"

	"github.com/sirupsen/logrus"
	"google.golang.org/protobuf/proto"
)

// Handler is an RPC message handler
type Handler func(*Server, []byte, *RequestContext) (proto.Message, error)

// RequestHeader contains the custom headers from a request
type RequestHeader struct {
	Signature []byte
	Method    string
	Sequence  int32
	Token     string
}

// RequestContext provides contextual information about a request
type RequestContext struct {
	Token  *ClientToken
	Header *RequestHeader
}

// Server is a RPC server instance
type Server struct {
	Logger      *logrus.Logger
	Certificate tls.Certificate
	Status      chan string
	Shutdown    chan bool
	Handlers    map[string]Handler
	Clients     map[string]*ClientToken
}

// NewServer creates a new RPCServer instance
func NewServer(logger *logrus.Logger, Status chan string, Shutdown chan bool) *Server {
	server := &Server{
		Logger:   logger,
		Handlers: make(map[string]Handler, 0),
		Status:   Status,
		Shutdown: Shutdown,
		Clients:  make(map[string]*ClientToken),
	}
	return server
}

// VerifyHeaders checks that a request contains the correct headers &
// extracts their values into a working structure
func (rpc *Server) VerifyHeaders(req *http.Request, context *RequestContext) bool {
	context.Header = &RequestHeader{}

	context.Header.Method = req.Header.Get("Request-Method")
	if context.Header.Method == "" {
		rpc.Logger.Warn("Missing request method")
		return false
	}

	if context.Header.Method == "SERVICE-READY" {
		return true
	}

	// Token creation is part of key exchange, so it doesn't exist here yet
	if context.Header.Method != "KeyExchange" {
		context.Header.Token = req.Header.Get("Client-Token")
		if context.Header.Token == "" {
			rpc.Logger.Warn("Missing request client token")
			return false
		}
		var ok bool
		context.Token, ok = rpc.Clients[context.Header.Token]
		if !ok {
			rpc.Logger.Warn("Invalid client token")
			return false
		}
	}

	// base64 encoded signature of the request body
	signature := req.Header.Get("Message-Signature")
	if signature == "" {
		rpc.Logger.Warn("Missing request signature")
		return false
	}
	var err error
	context.Header.Signature, err = hex.DecodeString(signature)
	if err != nil {
		rpc.Logger.Warn("Error decoding request signature - ", err)
		return false
	}

	seq := req.Header.Get("Message-Sequence")
	if seq == "" {
		rpc.Logger.Warn("Missing request sequence")
		return false
	}
	parsedSeq, err := strconv.ParseInt(seq, 10, 32)
	if err != nil {
		rpc.Logger.Warn("Error decoding request sequence - ", err)
		return false
	}
	context.Header.Sequence = int32(parsedSeq)

	if context.Header.Method != "KeyExchange" {
		context.Token.RecvCounter++
		if context.Header.Sequence != context.Token.RecvCounter {
			rpc.Logger.Warn("Invalid message sequence received. Expected [", context.Token.RecvCounter, "] but got [", context.Header.Sequence, "]")
			return false
		}
	}

	return true
}

// ServeHTTP handles HTTP requests
func (rpc *Server) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	rpc.Logger.Debug("PING")

	// we only accept POST requests
	if req.Method != "POST" {
		rpc.Logger.Warn("Unexpected request method - ", req.Method)
		return
	}

	// we accept only one URL path of "/rpc"
	if req.URL.Path != "/rpc" {
		rpc.Logger.Warn("Unexpected request path - ", req.URL.Path)
		return
	}

	context := &RequestContext{}

	if !rpc.VerifyHeaders(req, context) {
		rpc.Logger.Warn("Failed verifying request headers")
		return
	}

	body, err := io.ReadAll(req.Body)
	if err != nil {
		rpc.Logger.Warn("Error reading request body - ", err)
		return
	}

	rpc.Logger.Debug("HTTP request for RPC method [", context.Header.Method, "]")
	if context.Header.Method == "SERVICE-READY" {
		_, err = resp.Write([]byte("OK"))
		rpc.Logger.Debug("ready!")
		if err != nil {
			rpc.Logger.Warn("Error writing response - ", err)
		}
		return
	}

	handler := rpc.FindHandler(context.Header.Method)
	if handler == nil {
		rpc.Logger.Warn("Could not find handler for method - ", context.Header.Method)
		return
	}

	decodedBody, err := hex.DecodeString(string(body))
	if err != nil {
		rpc.Logger.Warn("Error decoding request body - ", err)
		return
	}

	// key exchange requests contain the key needed to do verification
	// so we need to defer until after the request has been handled
	if context.Header.Method != "KeyExchange" {
		ok := rpc.VerifyRequest(decodedBody, context.Header.Signature, context)
		if !ok {
			rpc.Logger.Warn("Message Verification failed")
			return
		}
	}

	handlerResponse, err := handler(rpc, decodedBody, context)
	if err != nil {
		return
	}

	if context.Header.Method == "KeyExchange" {
		ok := rpc.VerifyRequest(decodedBody, context.Header.Signature, context)
		if !ok {
			rpc.Logger.Warn("Message Verification failed")
			return
		}
	}

	responseData, err := proto.Marshal(handlerResponse)
	if err != nil {
		rpc.Logger.Warn("Error marshaling response - ", err)
		return
	}
	encodedData := base64.StdEncoding.EncodeToString(responseData)

	// set response headers
	responseSignature := rpc.CreateSignature(responseData, context)
	resp.Header().Set("Message-Signature", responseSignature)

	context.Token.SendCounter++
	resp.Header().Set("Message-Sequence", strconv.FormatInt(int64(context.Token.SendCounter), 10))
	// repackage request method header so client doesn't need to keep track of it
	resp.Header().Set("Request-Method", context.Header.Method)

	// send response
	_, err = resp.Write([]byte(encodedData))
	if err != nil {
		rpc.Logger.Warn("Error writing response - ", err)
	}
}

// FindHandler matches a method name with a handler
func (rpc *Server) FindHandler(requestMethod string) Handler {
	for method, handler := range rpc.Handlers {
		if method == requestMethod {
			return handler
		}
	}
	return nil
}

// Start an RPC Server
func (rpc *Server) Start(port string) bool {
	ok := rpc.createCertificate()
	if !ok {
		rpc.Shutdown <- false
		return false
	}

	conn, err := net.Listen("tcp", port)
	if err != nil {
		rpc.Logger.Warn("Listen error - ", err)
		rpc.Shutdown <- false
		return false
	}
	tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{rpc.Certificate},
	}
	tlsListener := tls.NewListener(conn, tlsConfig)
	writer := rpc.Logger.Writer()
	defer writer.Close()
	server := &http.Server{
		Addr:     port,
		Handler:  rpc,
		ErrorLog: log.New(writer, "", 0),
	}
	rpc.Logger.Debug("RPC listening on port [", port, "]")

	// send a token to stdout so the frontend knows the backend is done initializing
	rpc.Status <- "SERVICE_READY"

	server.Serve(tlsListener)
	return true
}

// Stop performs shutdown routines before application termination
func (rpc *Server) Stop() {
}
