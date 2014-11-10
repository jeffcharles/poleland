#!/usr/bin/env node
/* global require */
'use strict';
var Q = require('q');
var dynamodbInfo = require('./../src/db/dynamodb-connection');
var dynamodb = dynamodbInfo.connection;
var tableName = dynamodbInfo.prefix + '_polls';

Q.ninvoke(dynamodb, 'describeTable', {
    TableName: tableName
}).then(null, function(err) {
    if(err.name !== 'ResourceNotFoundException') {
        throw err;
    }
    // no table to drop
    process.exit(0);
}).then(Q.ninvoke(dynamodb, 'deleteTable', {
    TableName: tableName
})).then(function() {
    console.log('Dropped ' + tableName);
    process.exit(0);
}, function(err) {
    console.error(err);
    process.exit(1);
});
