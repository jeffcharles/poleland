/* global exports, require */
'use strict';

var couchbase = require('couchbase');

var connection;

exports.init = function() {
    connection =
        new couchbase.Connection({host: '10.0.0.2:8091', bucket: 'poleland'});
};

exports.get = function() {
    return connection;
};

exports.shutdown = function() {
    connection.shutdown();
};
