var Stream = require('stream');
var util = require('util');

var Writable = function(writing, options) {
  this._writing = writing;
  options = options || {};
  options.objectMode = options.objectMode || false;
  options.highWaterMark = options.highWaterMark || (options.objectMode ? 16 : 16384);
  Stream.Writable.call(this, options);
};

Writable.prototype._write = function(chunk, encoding, callback) {
  this._writing.call(this, chunk, callback);
};

util.inherits(Writable, Stream.Writable);

module.exports = Writable;
