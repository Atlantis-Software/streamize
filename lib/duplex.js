var Stream = require('stream');
var util = require('util');
var Readable = require('./readable');
var Writable = require('./writable');

var Duplex = function(reading, writing, options) {
  this._reading = reading;
  this._writing = writing;

  options = options || {};
  options.readableObjectMode = options.objectMode || options.readableObjectMode || false;
  options.writableObjectMode = options.objectMode || options.writableObjectMode || false;
  options.readableHighWaterMark = options.highWaterMark || options.readableHighWaterMark || (options.readableObjectMode ? 16 : 16384);
  options.writableHighWaterMark = options.highWaterMark || options.writableHighWaterMark || (options.writableObjectMode ? 16 : 16384);
  Stream.Duplex.call(this, options);

  this.on('end', function() {
    this.ended = true;
  });

  this._read();
};

Duplex.prototype._ended = false;

Duplex.prototype._reading = false;

Duplex.prototype._read = Readable.prototype._read;

Duplex.prototype._startReading = Readable.prototype._startReading;

Duplex.prototype._write = Writable.prototype._write;

Duplex.prototype._destroy = Readable.prototype._destroy;

util.inherits(Duplex, Stream.Duplex);

module.exports = Duplex;
