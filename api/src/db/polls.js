/* global exports, require */
'use strict';
var btoa = require('btoa');
var Q = require('q');
var uuid = require('node-uuid');
var dynamoInfo = require('./dynamodb-connection');
var dynamoConnection = dynamoInfo.connection;
var tableName = dynamoInfo.prefix + '_polls';

/**
 * @param {!string} id
 * @returns {!Promise.<PollDoc|PollNotFoundError|Error>}
 */
function getPollWithId(id) {
    return Q.ninvoke(dynamoConnection, 'getItem', {
        TableName: tableName,
        Key: { _id: id },
        ConsistentRead: true
    }).then(function(result) {
        if(!Object.keys(result).length) {
            var newErr = new Error('Poll not found');
            newErr.name = 'pollNotFound';
            throw newErr;
        }
        var poll = result.Item.poll;
        poll._id = id;
        return poll;
    });
}

/**
 * @param {string} continueAfter
 * @param {number} limit
 * @returns {!Promise.<QueryResults<PollDoc[]>|Error>}
 */
exports.getPolls = function(continueAfter, limit) {
    var params = {
        TableName: tableName,
        Limit: limit || 100
    };
    if(continueAfter) {
        params.ExclusiveStartKey = { _id: continueAfter };
    }
    return Q.ninvoke(dynamoConnection, 'scan', params)
        .then(function(results) {
            var inlineId = function(item) {
                var poll = item.poll;
                poll._id = item._id;
                return poll;
            };
            var data = { items: results.Items.map(inlineId) };
            if(results.LastEvaluatedKey) {
                data.continueAfter = results.LastEvaluatedKey._id;
            }
            return data;
        });
};

/**
 * @param {!RawPoll} poll
 * @returns {!Promise.<CbPoll|Error>}
 */
exports.createPoll = function(poll) {
    var id = btoa(uuid.v4());
    poll._version = 1;
    return Q.ninvoke(dynamoConnection, 'putItem', {
        TableName: tableName,
        Item: {
            _id: id,
            poll: poll
        }
    }).then(function() {
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
    poll._version = 1;
    return Q.ninvoke(dynamoConnection, 'putItem', {
        TableName: tableName,
        Item: {
            _id: id,
            poll: poll
        }
    });
};

/**
 * @param {!string} id
 * @returns {!Promise.<undefined|Error>}
 */
exports.deletePoll = function(id) {
    return Q.ninvoke(dynamoConnection, 'deleteItem', {
        TableName: tableName,
        Key: { _id: id }
    });
};
