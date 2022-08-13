# default target
build-backend:
	go build -mod=vendor ./cmd/brewtheory-desktop; cp brewtheory-desktop.exe desktop/src/resources/backend.exe

build-desktop:
	cd desktop; npm run build:dev

build-all:
	build-backend build-desktop

# install the protoc golang plugin
# See: https://developers.google.com/protocol-buffers/docs/gotutorial#compiling-your-protocol-buffers
proto-gen:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest; \
	npm install -g protoc-gen-ts

# rebuild the proto definitions
# The protoc tool is sourced from: https://github.com/protocolbuffers/protobuf/releases
proto:
	PATH=$$PATH:$$GOPATH/bin ./third_party/protoc/win64/bin/protoc proto/*.proto -Iproto --go_out=.

# For this to work, need to have global node modules in path (see output of: `npm config get prefix`)
# See: https://github.com/thesayyn/protoc-gen-ts
proto-ts:
	PATH=$$PATH:./third_party/protoc/win64/bin/ protoc.exe proto/*.proto -Iproto --ts_out=desktop/src/proto

proto-all: proto proto-js

.PHONY: proto build-backend build-desktop