"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_stream_1 = require("node:stream");
const stream_json_1 = require("stream-json");
const StreamArray_1 = require("stream-json/streamers/StreamArray");
const fileStream = node_fs_1.default.createReadStream('./bigfile.json');
const transformedStream = new node_stream_1.Transform({
    objectMode: true,
    write(ck, en, cbc) {
        this.push({
            id: ck.value.name
        });
        cbc();
    }
});
const witrablestream = new node_stream_1.Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
        console.log(chunk); // Log each item from the stream
        callback();
    }
});
(0, node_stream_1.pipeline)(fileStream, (0, stream_json_1.parser)(), (0, StreamArray_1.streamArray)(), transformedStream, witrablestream, err => {
    if (err) {
        console.error('Pipeline failed:', err);
    }
    else {
        console.log('Pipeline succeeded');
    }
});
