/* global after, before, describe, it, require */
'use strict';

var request = require('supertest');
var appContainer = require('./../../../src/app');

var app = appContainer.app;

before(function() {
    appContainer.start();
});

after(function() {
    appContainer.stop();
});

describe('POST /api/v1/polls/:id/submissions', function() {
    it('for a valid poll, returns a 200', function(done) {
        request(app)
            .post('/api/v1/polls/1/submissions')
            .expect(200, done);
    });
    it('for a poll that doesn\'t exist, returns 404', function(done) {
        request(app)
            .post('/api/v1/polls/0/submissions')
            .expect(404, done);
    });
});
