# default target
build:
	go build -mod=vendor ./cmd/brewtheory-desktop; cp brewtheory-desktop.exe desktop/src/resources/backend.exe

# install the protoc golang plugin
# See: https://developers.google.com/protocol-buffers/docs/gotutorial#compiling-your-protocol-buffers
proto-gen:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

# rebuild the proto definitions
# The protoc tool is sourced from: https://github.com/protocolbuffers/protobuf/releases
proto:
	PATH=$$PATH:$$GOPATH/bin ./third_party/protoc/bin/protoc internal/electron/proto/*.proto --go_out=.

proto-copy:
	cp internal/electron/proto/*.proto desktop/src/proto/

proto-js:
	cd desktop/src/proto; ../../../third_party/protoc/bin/protoc -I . *.proto --js_out=import_style=commonjs,binary:.

proto-all: proto proto-copy proto-js

.PHONY: proto