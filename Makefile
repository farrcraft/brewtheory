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
	PATH=$$PATH:$$GOPATH/bin ./third_party/protoc/win64/bin/protoc internal/electron/proto/*.proto -Iinternal/electron/proto --go_out=.

proto-js:
	./third_party/protoc/win64/bin/protoc.exe internal/electron/proto/*.proto -Iinternal/electron/proto --js_out=import_style=commonjs,binary:desktop/src/proto
	
# mv internal/electron/proto/*.js desktop/src/proto/

proto-all: proto proto-js

.PHONY: proto