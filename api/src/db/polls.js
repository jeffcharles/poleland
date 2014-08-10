/* global exports, require */
'use strict';
var btoa = require('btoa');
var couchbase = require('couchbase');
var Q = require('q');
var uuid = require('node-uuid');
var VError = require('verror');
var cbConnection = require('./couchbase-connection');

/**
 * @param {!string} couchbaseId
 * @returns {!string}
 */
function transformId(couchbaseId) {
    return couchbaseId.replace('polls/', '');
}

/**
 * @param {!string} id
 * @returns {!Promise.<PollDoc|PollNotFoundError|Error>}
 */
function getPollWithId(id) {
    var db = cbConnection.get();
    return Q.ninvoke(db, 'get', 'polls/' + id, null)
        .then(function(result) {
            result.value._id = id;
            return result.value;
        }, function(err) {
            if(err.code === couchbase.errors.keyNotFound) {
                var newErr = new VError(err, 'Poll not found');
                newErr.name = 'pollNotFound';
                throw newErr;
            }
            throw err;
        });
}

/**
 * @returns {!Promise.<PollDoc[]|Error>}
 */
exports.getPolls = function() {
    var db = cbConnection.get();
    var pollsQuery = db.view('polls', 'polls', null); // FIXME
    return Q.ninvoke(pollsQuery, 'query', null)
        .then(function(results) {
            var pollKeys = results[0].map(function(t) { return t.key; });
            return Q.Promise(function(resolve, reject) {
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
                           reject(
                               new Error('Not sure how to handle this case'));
                       }
                   }
                   if(errors.length > 0) {
                       reject(errors[0]);
                   } else {
                       resolve(polls);
                   }
                });
            });
        });
};

/**
 * @param {!RawPoll} poll
 * @returns {!Promise.<CbPoll|Error>}
 */
exports.createPoll = function(poll) {
    var id = btoa(uuid.v4());
    poll._type = 'poll';
    poll._version = 1;
    var db = cbConnection.get();
    return Q.ninvoke(db, 'add', 'polls/' + id, poll)
        .then(function() {
            return getPollWithId(id);
        });
};

/**
 * @param {!string} id
 * @returns {!Promise.<CbPoll|PollNotFoundError|Error>}
 */
exports.getPoll = function(id) {
    return getPollWithId(id);
};

/**
 * @param {!string} id
 * @param {!RawPoll} poll
 * @returns {!Promise.<undefined|Error>}
 */
exports.updatePoll = function(id, poll) {
    var db = cbConnection.get();
    return Q.ninvoke(db, 'replace', 'polls/' + id, poll);
};

/**
 * @param {!string} id
 * @returns {!Promise.<undefined|Error>}
 */
exports.deletePoll = function(id) {
    var db = cbConnection.get();
    return Q.ninvoke(db, 'remove', 'polls/' + id, null);
};
