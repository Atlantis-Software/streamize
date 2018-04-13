var Readable = require('./lib/readable');
var Writable = require('./lib/writable');
var Duplex = require('./lib/duplex');
var Transform = require('./lib/transform');

module.exports = {
  Readable: function(read, options) {
    return new Readable(read, options);
  },
  Writable: function(write, options) {
    return new Writable(write, options);
  },
  Duplex: function(read, write, options) {
    return new Duplex(read, write, options);
  },
  Transform: function(transform, options) {
    return new Transform(transform, options);
  },
  obj: {
    Readable: function(read, options) {
      options = options || {};
      options.objectMode = true;
      return module.exports.Readable(read, options);
    },
    Writable: function(write, options) {
      options = options || {};
      options.objectMode = true;
      return module.exports.Writable(write, options);
    },
    Duplex: function(read, write, options) {
      options = options || {};
      options.objectMode = true;
      return module.exports.Duplex(read, write, options);
    },
    Transform: function(transform, options) {
      options = options || {};
      options.objectMode = true;
      return module.exports.Transform(transform, options);
    }
  }
};
