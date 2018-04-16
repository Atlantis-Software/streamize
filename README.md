# streamize
stream helper for NodeJs

[![NPM Version](https://img.shields.io/npm/v/streamize.svg)](https://www.npmjs.com/package/streamize)
[![NPM Downloads](https://img.shields.io/npm/dm/streamize.svg)](https://www.npmjs.com/package/streamize)
[![Build](https://img.shields.io/travis/Atlantis-Software/streamize/master.svg?label=build)](https://travis-ci.org/Atlantis-Software/streamize)
[![Coverage Status](https://coveralls.io/repos/github/Atlantis-Software/streamize/badge.svg?branch=master)](https://coveralls.io/github/Atlantis-Software/streamize?branch=master)
[![NSP Status](https://nodesecurity.io/orgs/atlantis/projects/ed0ada30-0689-4121-b3b8-9d80f793d292/badge)](https://nodesecurity.io/orgs/atlantis/projects/ed0ada30-0689-4121-b3b8-9d80f793d292)
[![Dependencies Status](https://david-dm.org/Atlantis-Software/streamize.svg)](https://david-dm.org/Atlantis-Software/streamize)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install streamize
```

## Documentation

### Readable

Description: create a readable stream

`streamize.Readable(read, [options])`
* read is a function that take a callback function as argument.
* options is an optional object argument passed to the node stream: [see node readable stream documentation](https://nodejs.org/api/stream.html#stream_new_stream_readable_options)

return a readable stream

#### sample
```javascript
var streamize = require('streamize');
var myArray = ['1', '2', '3', '4', '5'];
// create a readable stream from myArray
var readable = streamize.Readable(function(cb) {
  cb(null, myArray.shift() || null);
});
```

the read function passed in argument is called each time a new chunk is required.
the callback takes 2 arguments:
* error

When error is defined and not null, the stream returned emit the error and chunk is ignored.
* chunk

When chunk is a Buffer, Uint8Array or string, the chunk of data will be added to the internal queue for users of the stream to consume.
Passing chunk as null signals the end of the stream (EOF), after which no more data can be written.

As read function is called in the stream context, every internal function could be called from `this`.

```javascript
var readable = streamize.Readable(function(cb) {
  // push 'a' into the stream
  this.push('a');
  cb(null, myArray.shift() || null);
});
```

### Writable

Description: create a writable stream

`streamize.Writable(write, [options])`
* write is a function that take the chunk to be written and a callback function as arguments.
* options is an optional object argument passed to the node stream: [see node writable stream documentation](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options)

#### sample
```javascript
var streamize = require('streamize');
var newArray = [];
// create a writable stream that push chunk in newArray
var writable = streamize.Writable(function(chunk, cb) {
  newArray.push(chunk);
  cb();
});
```

the write function is called each time a chunk should be written.
chunk <Buffer> | <string> | <any> The chunk to be written. Will always be a buffer unless the decodeStrings option was set to false or the stream is operating in object mode.
callback <Function> Call this function (optionally with an error argument) when processing is complete for the supplied chunk.

### Duplex

Description: create a duplex stream

`streamize.Duplex(read, write, [options])`
* read is a function that take a callback function as argument.[see Readable read function](#readable)
* write is a function that take the chunk to be written and a callback function as arguments.[see Writable write function](#writable)
* options is an optional object argument passed to the node stream: [see node duplex stream documentation](https://nodejs.org/api/stream.html#stream_new_stream_duplex_options)

#### sample
```javascript
var streamize = require('streamize');
var myArray = ['1', '2', '3', '4', '5'];
var newArray = [];
// create a duplex stream that read myArray and write in newArray
var duplex = streamize.Duplex(function(cb) {
  cb(null, myArray.shift() || null);
}, function(data, cb) {
  newArray.push(chunk);
  cb();
});
```

### Transform

Description: create a transform stream

`streamize.Transform(transform, [options])`
* transform is a function that take the chunk to be transform and a callback function as arguments.
* options is an optional object argument passed to the node stream: [see node transform stream documentation](https://nodejs.org/api/stream.html#stream_new_stream_transform_options)

#### sample
```javascript
var streamize = require('streamize');
// create a transform stream that duplicate all chunks
var transform = streamize.Transform(function(chunk, cb) {
  this.push(chunk);
  cb(null, chunk);
});
```

the transform function is called each time a chunk should be transform.
chunk <Buffer> | <string> | <any> The chunk to be written. Will always be a buffer unless the decodeStrings option was set to false or the stream is operating in object mode.
callback <Function> A callback function (optionally with an error argument and data) to be called after the supplied chunk has been processed.

As transform function is called in the stream context, every internal function could be called from `this`.

### Object mode

`streamize.obj.Readable(read, [options])`
`streamize.obj.Writable(write, [options])`
`streamize.obj.Duplex(read, write, [options])`
`streamize.obj.Transform(transform, [options])`

do the same but return a stream in object mode.
