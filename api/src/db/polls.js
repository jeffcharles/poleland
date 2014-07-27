/* global exports, require */
'use strict';
var btoa = require('btoa');
var couchbase = require('couchbase');
var uuid = require('node-uuid');
var cbConnection = require('./couchbase-connection');

function transformId(couchbaseId) {
    return couchbaseId.replace('polls/', '');
}

function getPollWithId(id, callback) {
    var db = cbConnection.get();
    db.get('polls/' + id, null, function(err, result) {
        if(err) {
            if(err.code === couchbase.errors.keyNotFound) {
                var newErr = new Error('Poll not found');
                newErr.type = 'pollNotFound';
                callback(newErr);
            } else {
                callback(err);
            }
            return;
        }
        result.value._id = id;
        callback(null, result.value);
    });
}

exports.getPolls = function(callback) {
    var db = cbConnection.get();
    var pollsQuery = db.view('polls', 'polls', null); // FIXME
    pollsQuery.query(null, function(err, results) {
        if(err) {
            callback(err);
        } else {
            var pollKeys = results.map(function(t) { return t.key; });
            db.getMulti(pollKeys, null, function(err, results) {
                var polls = [];
                var errors = [];
                for(var id in results) {
                    var value = results[id];
                    if(value.error) {
                        if(value.error !== couchbase.errors.keyNotFound) {
                            errors.push(value.error);
                        }
                    } else if(value.value) {
                        var poll = value.value;
                        poll._id = transformId(id);
                        polls.push(poll);
                    } else {
                        callback(new Error('Not sure how to handle this case'));
                    }
                }
                if(errors) {
                    callback(errors[0], polls);
                } else {
                    callback(null, polls);
                }
            });
        }
    });
};

exports.createPoll = function(poll, callback) {
    var id = btoa(uuid.v4());
    poll._type = 'poll';
    poll._version = 1;
    var db = cbConnection.get();
    db.add('polls/' + id, poll, function(err) {
        if(err) {
            callback(err);
        } else {
            getPollWithId(id, callback);
        }
    });
};

exports.getPoll = function(id, callback) {
    getPollWithId(id, callback);
};

exports.updatePoll = function(id, poll, callback) {
    var db = cbConnection.get();
    db.replace('polls/' + id, poll, callback);
};

exports.deletePoll = function(id, callback) {
    var db = cbConnection.get();
    db.remove('polls/' + id, null, callback);
};
