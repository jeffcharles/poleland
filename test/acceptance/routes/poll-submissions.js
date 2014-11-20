/* global describe, it, require */
'use strict';

var request = require('supertest-as-promised');
var app = require('./../../../src/app');
var helpers = require('./../helpers');

describe('POST /api/v1/polls/:id/submissions', function() {
    it('for a valid poll, returns a 200', function() {
        var relativeUrl;
        return helpers.createPoll()
            .then(function(pollRelativeUrl) {
                relativeUrl = pollRelativeUrl;
                return request(app)
                    .post(pollRelativeUrl + '/submissions')
                    .expect(200);
            }).then(function() {
                return helpers.deletePoll(relativeUrl);
            });
    });

    it('for a poll that doesn\'t exist, returns 404', function() {
        return request(app)
            .post('/api/v1/polls/0/submissions')
            .expect(404);
    });
});
