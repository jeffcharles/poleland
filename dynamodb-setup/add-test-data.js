#!/usr/bin/env node
/* global console, require */
'use strict';
var BPromise = require('bluebird');
var dynamodbInfo = require('./../src/db/dynamodb-connection');
var dynamodb = BPromise.promisifyAll(dynamodbInfo.connection);

var polls = {
    '1': {
        _type: 'poll',
        _version: 1,
        title: 'Random stuff',
        questions: [
            {
                id: '1',
                content: 'What do you think of foo?',
                answers: [
                    {
                        id: '1',
                        content: 'I like it!'
                    },
                    {
                        id: '2',
                        content: 'I\'m indifferent'
                    },
                    {
                        id: '3',
                        content: 'I hate it!'
                    }
                ]
            },
            {
                id: '2',
                content: 'What is 2 + 3?',
                answers: [
                    {
                        id: '1',
                        content: '4'
                    },
                    {
                        id: '2',
                        content: '5'
                    },
                    {
                        id: '3',
                        content: '6'
                    }
                ]
            }
        ]
    },
    '2': {
        _type: 'poll',
        _version: 1,
        title: 'Awesomeness measurements',
        questions: [
            {
                id: '1',
                content: 'Is this awesome?',
                answers: [
                    {
                        id: '1',
                        content: 'Yes'
                    },
                    {
                        id: '2',
                        content: 'No'
                    }
                ]
            }
        ]
    }
};

var putPromises = Object.keys(polls).map(function(pollId) {
    return dynamodb.putItemAsync({
        TableName: dynamodbInfo.prefix + '_polls',
        ConditionExpression: 'attribute_not_exists(id)',
        Item: {
            id: pollId,
            poll: polls[pollId]
        }
    }).then(function(result) {
        console.log('Created document in polls for ' + pollId);
    }).error(function(err) {
        if(err.cause.code !== 'ConditionalCheckFailedException') {
            throw err;
        }
    });
});

BPromise.all(putPromises)
    .then(function() {
        process.exit(0);
    }).catch(function(err) {
        console.error(err);
        process.exit(1);
    });
