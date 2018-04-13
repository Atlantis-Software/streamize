var Stream = require('stream');
var util = require('util');

var Readable = function(reading, options) {
  this._reading = reading;
  options = options || {};
  options.objectMode = options.objectMode || false;
  options.highWaterMark = options.highWaterMark || (options.objectMode ? 16 : 16384);
  Stream.Readable.call(this, options);

  this.on('end', function() {
    this._ended = true;
  });

  this._read();
};

Readable.prototype._ended = false;

Readable.prototype._isReading = false;

Readable.prototype._read = function() {
  if (!this._isReading && !this.ended) {
    this._isReading = true;
    this._startReading();
  }
};

Readable.prototype._destroy = function() {
  this._ended = true;
  this.emit('close');
};

Readable.prototype._startReading = function() {
  var self = this;
  this._reading.call(this, function(err, data) {
    if (err) {
      self._destroy();
      return setTimeout(function() {
        self.emit('error', err);
      }, 0);
    }

    if (data === null) {
      self._ended = true;
      self.push(null);
      return;
    }

    if ((data === void 0) || self.push(data)) {
      setTimeout(function() {
        self._startReading();
      }, 0);
    } else {
      self._isReading = false;
    }
  });
};

util.inherits(Readable, Stream.Readable);

module.exports = Readable;