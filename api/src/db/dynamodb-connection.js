/* global module, process, require */
'use strict';
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');

var dbPrefix = process.env.DYNAMO_DB_PREFIX;
if(!dbPrefix) {
    throw new Error('Missing DYNAMO_DB_PREFIX');
}

var dynamodb = new DOC.DynamoDB(new AWS.DynamoDB({
    endpoint: process.env.DYNAMO_DB_URL || 'http://localhost:8000',
    apiVersion: '2012-08-10',
    region: 'us-east-1'
}));

module.exports = {
    connection: dynamodb,
    prefix: dbPrefix
};
