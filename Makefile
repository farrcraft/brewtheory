all: build

build:
	go build -mod=vendor ./cmd/brewtheory-desktop
