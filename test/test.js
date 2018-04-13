var lib = require('../index');
var stream = require('stream');
var assert = require('assert');

describe('', function() {
  it('.Readable(fct, [opts]) should create Readable stream', function() {
    var readable = lib.Readable(function() {});
    assert((readable instanceof stream.Readable));
  });

  it('.Writable(fct, [opts]) should create Writable stream', function() {
    var writable = lib.Writable(function() {});
    assert((writable instanceof stream.Writable));
  });

  it('.Duplex(fct, fct, [opts]) should create Duplex stream', function() {
    var duplex = lib.Duplex(function() {}, function() {});
    assert((duplex instanceof stream.Duplex));
  });

  it('.Transform(fct, [opts]) should create Transform stream', function() {
    var transform = lib.Transform(function() {});
    assert((transform instanceof stream.Transform));
  });

  it('.obj.Readable(fct, [opts]) should create Readable stream in object mode', function() {
    var readable = lib.obj.Readable(function() {});
    assert((readable instanceof stream.Readable));
    assert.doesNotThrow(function() {
      readable.push({});
    }, 'stream is not in object mode');
  });

  it('.obj.Writable(fct, [opts]) should create Writable stream in object mode', function() {
    var writable = lib.obj.Writable(function() {});
    assert((writable instanceof stream.Writable));
    assert.doesNotThrow(function() {
      writable.write({});
    }, 'stream is not in object mode');
  });

  it('.obj.Duplex(fct, fct, [opts]) should create Duplex stream in object mode', function() {
    var duplex = lib.obj.Duplex(function() {}, function() {});
    assert((duplex instanceof stream.Duplex));
    assert.doesNotThrow(function() {
      duplex.write({});
      duplex.push({});
    }, 'stream is not in object mode');
  });

  it('.obj.Transform(fct, [opts]) should create Transform stream in object mode', function() {
    var transform = lib.obj.Transform(function() {});
    assert((transform instanceof stream.Transform));
          transform.write({});
      transform.push({});
    assert.doesNotThrow(function() {
      transform.write({});
      transform.push({});
    }, 'stream is not in object mode');
  });

  it('.Readable should buffering data', function(done) {
    var highWaterMark = 2;
    var readable = lib.Readable(function(cb) {
      cb(null, Buffer.from('a'));
    }, {
      highWaterMark: highWaterMark
    });
    
    setTimeout(function() {
      assert.equal(readable._readableState.length, highWaterMark, 'buffer size shoud be equal to highWaterMark');
      done();
    }, highWaterMark * 10);
  });

  it('.Writable should buffering data', function(done) {
    var highWaterMark = 2;
    var readable = lib.Readable(function(cb) {
      cb(null, Buffer.from('a'));
    }, {
      highWaterMark: highWaterMark
    });

    var writable = lib.Writable(function(cb) {
    }, {
      highWaterMark: highWaterMark
    });
    readable.pipe(writable);
    setTimeout(function() {
      assert.equal(writable._writableState.length, highWaterMark, 'buffer size shoud be equal to highWaterMark');
      done();
    }, highWaterMark * 10);
  });

  it('.Duplex should buffering data', function(done) {
    var highWaterMark = 2;
    var duplex = lib.Duplex(function(cb) {
      cb(null, Buffer.from('a'));
    }, function(data, cb) {
    }, {
      highWaterMark: highWaterMark
    });

    var readable = lib.Readable(function(cb) {
      cb(null, Buffer.from('b'));
    }, {
      highWaterMark: highWaterMark
    });

    readable.pipe(duplex);

    setTimeout(function() {
      assert.equal(duplex._readableState.length, highWaterMark, 'readable buffer size shoud be equal to highWaterMark');
      assert.equal(duplex._writableState.length, highWaterMark, 'writable buffer size shoud be equal to highWaterMark');
      done();
    }, highWaterMark * 10);
  });

  it('.Transform should buffering data', function(done) {
    var highWaterMark = 2;
    var transform = lib.Transform(function(data, cb) {
      cb(null, data);
    }, {
      highWaterMark: highWaterMark
    });

    var readable = lib.Readable(function(cb) {
      cb(null, Buffer.from('a'));
    }, {
      highWaterMark: highWaterMark
    });

    readable.pipe(transform);

    setTimeout(function() {
      assert.equal(transform._readableState.length, highWaterMark, 'readable buffer size shoud be equal to highWaterMark');
      assert.equal(transform._writableState.length, highWaterMark, 'buffer size shoud be equal to highWaterMark');
      done();
    }, highWaterMark * 10);
  });

  it('.Readable should ending when callback return a null', function(done) {
    var i = 0;
    var readable = lib.Readable(function(cb) {
      if (++i === 10) {
        return cb(null, null);
      }
      cb(null, Buffer.from('a'));
    });

    var writable = lib.Writable(function() {});
    readable.pipe(writable);
    readable.on('end', function() {
      done();
    });
  });

  it('.Writable should finish when piped stream ending', function(done) {
    var i = 0;
    var readable = lib.Readable(function(cb) {
      if (++i === 10) {
        return cb(null, null);
      }
      cb(null, Buffer.from('a'));
    });

    var writable = lib.Writable(function(data, cb) { cb(); });
    readable.pipe(writable);
    writable.on('finish', function() {
      done();
    });
  });

  it('.Readable should emit error when callback return an error', function(done) {
    var i = 0;
    var err = new Error('this is an error');
    var readable = lib.Readable(function(cb) {
      if (++i === 1) {
        return cb(err);
      }
      cb(null, Buffer.from('a'));
    });
    readable.on('error', function(error) {
      assert.equal(err, error);
      done();
    });
  });

  it('.Writable should emit error when callback return an error', function(done) {
    var readable = lib.Readable(function(cb) {
      cb(null, Buffer.from('a'));
    });
    var i = 0;
    var err = new Error('this is an error');

    var writable = lib.Writable(function(data, cb) {
      if (++i === 10) {
        return cb(err);
      }
      cb();
    });
    readable.pipe(writable);
    writable.on('error', function(error) {
      assert.equal(err, error);
      done();
    });
  });

  it('.Duplex should emit error when callback return an error', function(done) {
    var readable = lib.Readable(function(cb) {
      cb(null, Buffer.from('a'));
    });

    var writable = lib.Writable(function(data, cb) {
      cb();
    });

    var i = 0;
    var j = 0;
    var read_err = new Error('this is a read error');
    var write_err = new Error('this is a write error');
    var duplex = lib.Duplex(function(cb) {
      if (++i === 10) {
        return cb(read_err);
      }
      cb(null, Buffer.from('b'));
    }, function(data, cb) {
      if (++j === 10) {
        return cb(write_err);
      }
      cb();
    });

    readable.pipe(duplex);
    duplex.pipe(writable);

    var errs = [];
    duplex.on('error', function(error) {
      errs.push(error);
      if (errs.length === 2) {
        done();
      }
    });
  });

  it('.Transform should emit error when callback return an error', function(done) {
    var i = 0;
    var err = new Error('this is a transform error');
    var transform = lib.Transform(function(data, cb) {
      if (++i === 10) {
        return cb(err);
      }
      cb(null, data);
    });

    var readable = lib.Readable(function(cb) {
      cb(null, Buffer.from('a'));
    });

    readable.pipe(transform);

    transform.on('error', function(error) {
      assert.equal(err, error);
      done();
    });
  });

  it('.Readable should ignore result when callback return an undefined', function(done) {
    var i = 0;
    var j = 0;
    var readable = lib.Readable(function(cb) {
      ++i;
      if (i === 10) {
        return cb();
      }
      if (i === 20) {
        return cb(null, null);
      }
      cb(null, Buffer.from('a'));
    });
    var writable = lib.Writable(function(data, cb) {
      ++j;
      cb();
    });
    readable.pipe(writable);
    writable.on('finish', function() {
      assert.equal(j, 18);
      done();
    });
  });

  it('.Transform should ignore result when callback return an undefined', function(done) {
    var i = 0;
    var j = 0;
    var k = 0;
    var readable = lib.Readable(function(cb) {
      if (++i === 20) {
        return cb(null, null);
      }
      cb(null, Buffer.from('a'));
    });
    var transform = lib.Transform(function(data, cb) {
      if (++k === 10) {
        return cb();
      }
      cb(null, data);
    });
    readable.pipe(transform);
    var writable = lib.Writable(function(data, cb) {
      ++j;
      cb();
    });
    transform.pipe(writable);
    writable.on('finish', function() {
      assert.equal(j, 18);
      done();
    });
  });

  it('.Readable should add chunk on push', function(done) {
    var i = 0;
    var j = 0;
    var readable = lib.Readable(function(cb) {
      ++i;
      if (i === 21) {
        return cb(null, null);
      }
      this.push(Buffer.from('a'));
      cb(null, Buffer.from('a'));
    });
    var writable = lib.Writable(function(data, cb) {
      ++j;
      cb();
    });
    readable.pipe(writable);
    writable.on('finish', function() {
      assert.equal(j, 40);
      done();
    });
  });


  it('.Transform should add chunk on push', function(done) {
    var i = 0;
    var j = 0;
    var readable = lib.Readable(function(cb) {
      if (++i === 21) {
        return cb(null, null);
      }
      cb(null, Buffer.from('a'));
    });
    var transform = lib.Transform(function(data, cb) {
      this.push(data);
      cb(null, data);
    });
    readable.pipe(transform);
    var writable = lib.Writable(function(data, cb) {
      ++j;
      cb();
    });
    transform.pipe(writable);
    writable.on('finish', function() {
      assert.equal(j, 40);
      done();
    });
  });

});
