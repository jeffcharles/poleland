#!/usr/bin/env node
/* global require */
'use strict';
var BPromise = require('bluebird');
var dynamodbInfo = require('./../src/db/dynamodb-connection');
var dynamodb = BPromise.promisifyAll(dynamodbInfo.connection);
var tableName = dynamodbInfo.prefix + '_polls';

dynamodb.describeTableAsync({
    TableName: tableName
}).error(function(err) {
    if(err.cause.name !== 'ResourceNotFoundException') {
        throw err;
    }
    // no table to drop
    process.exit(0);
}).then(dynamodb.deleteTableAsync({
    TableName: tableName
})).then(function() {
    console.log('Dropped ' + tableName);
    process.exit(0);
}).catch(function(err) {
    console.error(err);
    process.exit(1);
});
