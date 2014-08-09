/* global exports, require */
'use strict';

var assert = require('assert');
var request = require('supertest');
var appContainer = require('./../../src/app');

var app = appContainer.app;

exports.poll = {
    title: 'Test',
    questions: [
        {
            id: '1',
            content: 'Is this great?',
            answers: [
                {
                    id: '1',
                    content: 'No!'
                }, {
                    id: '2',
                    content: 'Meh'
                }, {
                    id: '3',
                    content: 'Yes!'
                }
            ]
        }
    ]
};

exports.createPoll = function(next) {
    request(app)
        .post('/api/v1/polls')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(exports.poll)
        .expect(201)
        .end(function(err, res) {
            assert.ifError(err);
            var relativeUrl =
                    '/' + res.header.location.split('/').slice(3).join('/');
            next(relativeUrl);
        });
};

exports.deletePoll = function(relativeUrl, next) {
    request(app)
        .delete(relativeUrl)
        .expect(204)
        .end(function(err) {
            assert.ifError(err);
            next();
        });
};

exports.createTemporaryPoll = function(func, next) {
    exports.createPoll(function(pollRelativeUrl) {
        func(pollRelativeUrl, function(err) {
            exports.deletePoll(pollRelativeUrl, function() {
                next(err);
            });
        });
    });
};
