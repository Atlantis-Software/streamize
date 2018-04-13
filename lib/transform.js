var Stream = require('stream');
var util = require('util');

var Transform = function(transforming, options) {
  this._transforming = transforming;
  options = options || {};
  options.readableObjectMode = options.objectMode || options.readableObjectMode || false;
  options.writableObjectMode = options.objectMode || options.writableObjectMode || false;
  options.readableHighWaterMark = options.highWaterMark || options.readableHighWaterMark || (options.readableObjectMode ? 16 : 16384);
  options.writableHighWaterMark = options.highWaterMark || options.writableHighWaterMark || (options.writableObjectMode ? 16 : 16384);
  Stream.Transform.call(this, options);
};

Transform.prototype._transform = function(data, encoding, callback) {
  this._transforming.call(this, data, callback);
};

util.inherits(Transform, Stream.Transform);

module.exports = Transform;
