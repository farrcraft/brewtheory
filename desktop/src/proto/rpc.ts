/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.21.5
 * source: rpc.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./common";
import * as pb_1 from "google-protobuf";
export namespace brewtheory {
    export class EmptyRequest extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            header?: dependency_1.brewtheory.RequestHeader;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("header" in data && data.header != undefined) {
                    this.header = data.header;
                }
            }
        }
        get header() {
            return pb_1.Message.getWrapperField(this, dependency_1.brewtheory.RequestHeader, 1) as dependency_1.brewtheory.RequestHeader;
        }
        set header(value: dependency_1.brewtheory.RequestHeader) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get has_header() {
            return pb_1.Message.getField(this, 1) != null;
        }
        static fromObject(data: {
            header?: ReturnType<typeof dependency_1.brewtheory.RequestHeader.prototype.toObject>;
        }): EmptyRequest {
            const message = new EmptyRequest({});
            if (data.header != null) {
                message.header = dependency_1.brewtheory.RequestHeader.fromObject(data.header);
            }
            return message;
        }
        toObject() {
            const data: {
                header?: ReturnType<typeof dependency_1.brewtheory.RequestHeader.prototype.toObject>;
            } = {};
            if (this.header != null) {
                data.header = this.header.toObject();
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.has_header)
                writer.writeMessage(1, this.header, () => this.header.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): EmptyRequest {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new EmptyRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.header, () => message.header = dependency_1.brewtheory.RequestHeader.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): EmptyRequest {
            return EmptyRequest.deserialize(bytes);
        }
    }
    export class EmptyResponse extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            header?: dependency_1.brewtheory.ResponseHeader;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("header" in data && data.header != undefined) {
                    this.header = data.header;
                }
            }
        }
        get header() {
            return pb_1.Message.getWrapperField(this, dependency_1.brewtheory.ResponseHeader, 1) as dependency_1.brewtheory.ResponseHeader;
        }
        set header(value: dependency_1.brewtheory.ResponseHeader) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get has_header() {
            return pb_1.Message.getField(this, 1) != null;
        }
        static fromObject(data: {
            header?: ReturnType<typeof dependency_1.brewtheory.ResponseHeader.prototype.toObject>;
        }): EmptyResponse {
            const message = new EmptyResponse({});
            if (data.header != null) {
                message.header = dependency_1.brewtheory.ResponseHeader.fromObject(data.header);
            }
            return message;
        }
        toObject() {
            const data: {
                header?: ReturnType<typeof dependency_1.brewtheory.ResponseHeader.prototype.toObject>;
            } = {};
            if (this.header != null) {
                data.header = this.header.toObject();
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.has_header)
                writer.writeMessage(1, this.header, () => this.header.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): EmptyResponse {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new EmptyResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.header, () => message.header = dependency_1.brewtheory.ResponseHeader.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): EmptyResponse {
            return EmptyResponse.deserialize(bytes);
        }
    }
    export class IdRequest extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            header?: dependency_1.brewtheory.RequestHeader;
            id?: string;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("header" in data && data.header != undefined) {
                    this.header = data.header;
                }
                if ("id" in data && data.id != undefined) {
                    this.id = data.id;
                }
            }
        }
        get header() {
            return pb_1.Message.getWrapperField(this, dependency_1.brewtheory.RequestHeader, 1) as dependency_1.brewtheory.RequestHeader;
        }
        set header(value: dependency_1.brewtheory.RequestHeader) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get has_header() {
            return pb_1.Message.getField(this, 1) != null;
        }
        get id() {
            return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        static fromObject(data: {
            header?: ReturnType<typeof dependency_1.brewtheory.RequestHeader.prototype.toObject>;
            id?: string;
        }): IdRequest {
            const message = new IdRequest({});
            if (data.header != null) {
                message.header = dependency_1.brewtheory.RequestHeader.fromObject(data.header);
            }
            if (data.id != null) {
                message.id = data.id;
            }
            return message;
        }
        toObject() {
            const data: {
                header?: ReturnType<typeof dependency_1.brewtheory.RequestHeader.prototype.toObject>;
                id?: string;
            } = {};
            if (this.header != null) {
                data.header = this.header.toObject();
            }
            if (this.id != null) {
                data.id = this.id;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.has_header)
                writer.writeMessage(1, this.header, () => this.header.serialize(writer));
            if (this.id.length)
                writer.writeString(2, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): IdRequest {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new IdRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.header, () => message.header = dependency_1.brewtheory.RequestHeader.deserialize(reader));
                        break;
                    case 2:
                        message.id = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): IdRequest {
            return IdRequest.deserialize(bytes);
        }
    }
    export class IdResponse extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            header?: dependency_1.brewtheory.ResponseHeader;
            id?: string;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("header" in data && data.header != undefined) {
                    this.header = data.header;
                }
                if ("id" in data && data.id != undefined) {
                    this.id = data.id;
                }
            }
        }
        get header() {
            return pb_1.Message.getWrapperField(this, dependency_1.brewtheory.ResponseHeader, 1) as dependency_1.brewtheory.ResponseHeader;
        }
        set header(value: dependency_1.brewtheory.ResponseHeader) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        get has_header() {
            return pb_1.Message.getField(this, 1) != null;
        }
        get id() {
            return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
        }
        set id(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        static fromObject(data: {
            header?: ReturnType<typeof dependency_1.brewtheory.ResponseHeader.prototype.toObject>;
            id?: string;
        }): IdResponse {
            const message = new IdResponse({});
            if (data.header != null) {
                message.header = dependency_1.brewtheory.ResponseHeader.fromObject(data.header);
            }
            if (data.id != null) {
                message.id = data.id;
            }
            return message;
        }
        toObject() {
            const data: {
                header?: ReturnType<typeof dependency_1.brewtheory.ResponseHeader.prototype.toObject>;
                id?: string;
            } = {};
            if (this.header != null) {
                data.header = this.header.toObject();
            }
            if (this.id != null) {
                data.id = this.id;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.has_header)
                writer.writeMessage(1, this.header, () => this.header.serialize(writer));
            if (this.id.length)
                writer.writeString(2, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): IdResponse {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new IdResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.header, () => message.header = dependency_1.brewtheory.ResponseHeader.deserialize(reader));
                        break;
                    case 2:
                        message.id = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): IdResponse {
            return IdResponse.deserialize(bytes);
        }
    }
}