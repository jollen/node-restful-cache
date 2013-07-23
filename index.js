// Released under MIT license
// Copyright (c) 2013 Jollen Chen

var localCache = {};
var debug = false;

exports.get = function(req, cb) {
  // hash key is combined with request url, session and user ID (passport)
  var hashKey = req.url 
      + ';'
      + req.sessionID
      + ';'
      + req.user.id;

  if (debug) console.log("Search for key: " + hashKey);

  // instance of exception message
  var err = {
      message: 'unknown'
  };

  // get cached item
  var d = localCache[hashKey];

  if (typeof d != "undefined") {
      return d.value;
  } else {
      err.message = 'missed';
      // cache missed, throw exception
      throw err;
  }
}

exports.put = function(req, val) {
  // hash key is combined with request url, session and user ID (passport)
  var hashKey = req.url 
      + ';'
      + req.sessionID
      + ';'
      + req.user.id;

  var err = {
      message: 'unknown'
  };

  // put to cache
  var old = localCache[hashKey];

  if (old) {
      if (debug) console.log('memcache: refresh data for key ' + hashKey);
      localCache[hashKey] = val;
      return;
  }

  var data = {
      value: val, 
      timestamp: (new Date).getTime()
  };
  localCache[hashKey] = data;

  if (debug) console.log('memcache: new data with key ' + hashKey);
}

exports.del = function(req) {
  // hash key is combined with request url, session and user ID (passport)
  var hashKey = req.url 
      + ';'
      + req.sessionID
      + ';'
      + req.user.id;  
  delete localCache[hashKey];
}

exports.clear = function() {
  localCache = {};
}

exports.debug = function(bool) {
  debug = bool;
}