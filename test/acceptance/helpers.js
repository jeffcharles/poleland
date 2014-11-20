/* global exports, require */
'use strict';

var request = require('supertest-as-promised');
var app = require('./../../src/app');

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

exports.createPoll = function() {
    return request(app)
        .post('/api/v1/polls')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(exports.poll)
        .expect(201)
        .then(function(res) {
            var relativeUrl =
                    '/' + res.header.location.split('/').slice(3).join('/');
            return relativeUrl;
        });
};

exports.deletePoll = function(relativeUrl) {
    return request(app)
        .delete(relativeUrl)
        .expect(204);
};
