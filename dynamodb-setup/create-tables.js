#!/usr/bin/env node
/* global console, process, require */
'use strict';
var Q = require('q');
var dynamodbInfo = require('./../src/db/dynamodb-connection');
var dynamodb = dynamodbInfo.connection;
var tableName = dynamodbInfo.prefix + '_polls';

Q.ninvoke(dynamodb, 'describeTable', {
    TableName: tableName
}).then(function(data) {
    process.exit(0);
}, function(err) {
    if(err.name !== 'ResourceNotFoundException') {
        throw err;
    }
    return Q.ninvoke(dynamodb, 'createTable', {
        TableName: tableName,
        AttributeDefinitions: [{
            AttributeName: '_id',
            AttributeType: 'S'
        }],
        KeySchema: [{
            AttributeName: '_id',
            KeyType: 'HASH'
        }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    });
}).then(function() {
    console.log('Created ' + tableName);
    process.exit(0);
}, function(err) {
    console.error(err);
    process.exit(1);
})
.done();
