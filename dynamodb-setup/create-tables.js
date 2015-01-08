#!/usr/bin/env node
/* global console, process, require */
'use strict';
var BPromise = require('bluebird');
var dynamodbInfo = require('./../src/db/dynamodb-connection');
var dynamodb = BPromise.promisifyAll(dynamodbInfo.connection);
var tableName = dynamodbInfo.prefix + '_polls';

dynamodb.describeTableAsync({
    TableName: tableName
}).then(function(data) {
    process.exit(0);
}).error(function(err) {
    if(err.cause.name !== 'ResourceNotFoundException') {
        throw err;
    }
    return dynamodb.createTableAsync({
        TableName: tableName,
        AttributeDefinitions: [{
            AttributeName: 'id',
            AttributeType: 'S'
        }],
        KeySchema: [{
            AttributeName: 'id',
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
}).catch(function(err) {
    console.error(err);
    process.exit(1);
});
