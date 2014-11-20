/* global describe, it, require */
'use strict';

var assert = require('assert');
var request = require('supertest-as-promised');
var app = require('./../../../src/app');
var helpers = require('./../helpers');

describe('POST /api/v1/polls', function() {
    it('creates a new poll', function() {
        var relativeUrl;
        return request(app)
            .post('/api/v1/polls')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(helpers.poll)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect('Location', /^https?:\/\/.+\/api\/v1\/polls\/[A-Za-z0-9]+$/)
            .expect(201)
            .then(function(res) {
                var resPoll = res.body;
                delete resPoll._links;
                assert.deepEqual(resPoll, helpers.poll);

                relativeUrl =
                    '/' + res.header.location.split('/').slice(3).join('/');

                return request(app)
                    .get(relativeUrl)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200);
            }).then(function(res) {
                var resPoll = res.body;
                delete resPoll._links;
                assert.deepEqual(resPoll, helpers.poll);
                return helpers.deletePoll(relativeUrl);
            });
    });

    it('validates the poll', function() {
        return request(app)
            .post('/api/v1/polls')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ foo: 'bar' })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8');
    });
});

describe('GET /api/v1/polls', function() {
    it('returns a list of polls', function() {
        var relativeUrl;
        return helpers.createPoll()
            .then(function(pollRelativeUrl) {
                relativeUrl = pollRelativeUrl;
                return request(app)
                    .get('/api/v1/polls')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200);
            }).then(function() {
                return helpers.deletePoll(relativeUrl);
            });
    });

    it('handles load more', function() {
        var relativeUrl;
        return helpers.createPoll()
            .then(function(pollRelativeUrl) {
                relativeUrl = pollRelativeUrl;
                return request(app)
                    .get('/api/v1/polls?limit=1')
                    .set('Accept', 'application/json')
                    .expect(200);
            }).then(function(res) {
                var loadMoreHref = res.body._links.next;
                assert.ok(loadMoreHref);
                var relativeHref =
                        '/' + loadMoreHref.split('/').slice(3).join('/');

                return request(app)
                    .get(relativeHref)
                    .set('Accept', 'application/json')
                    .expect(200);
            }).then(function() {
                return helpers.deletePoll(relativeUrl);
            });
    });
});

describe('GET /api/v1/polls/:id', function() {
    it('returns a poll when it exists', function() {
        var relativeUrl;
        return helpers.createPoll()
            .then(function(pollRelativeUrl) {
                relativeUrl = pollRelativeUrl;
                return request(app)
                    .get(pollRelativeUrl)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200);
            }).then(function(res) {
                assert.ok(
                    res.body._links.self.href.indexOf(relativeUrl) > -1);
                return helpers.deletePoll(relativeUrl);
            });
    });

    it('returns a 404 when it does not exist', function() {
        return request(app)
            .get('/api/v1/polls/0')
            .set('Accept', '*/*')
            .expect(404);
    });
});

describe('PUT /api/v1/polls/:id', function() {
    it('updates a poll when it exists', function() {
        var relativeUrl;
        return helpers.createPoll()
            .then(function(pollRelativeUrl) {
                relativeUrl = pollRelativeUrl;
                return request(app)
                    .put(pollRelativeUrl)
                    .set('Content-Type', 'application/json; charset=utf-8')
                    .send(helpers.poll)
                    .expect(204);
            }).then(function() {
                return request(app)
                    .get(relativeUrl)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200);
            }).then(function(res) {
                var resPoll = res.body;
                delete resPoll._links;
                assert.deepEqual(resPoll, helpers.poll);

                return helpers.deletePoll(relativeUrl);
            });
    });

    it('returns a 404 when it does not exist', function() {
        return request(app)
            .put('/api/v1/polls/0')
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(helpers.poll)
            .expect(404);
    });

    it('validates the poll', function() {
        var relativeUrl;
        return helpers.createPoll()
            .then(function(pollRelativeUrl) {
                relativeUrl = pollRelativeUrl;
                return request(app)
                    .put(pollRelativeUrl)
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .send({ foo: 'bar' })
                    .expect(400)
                    .expect('Content-Type', 'application/json; charset=utf-8');
            }).then(function() {
                return helpers.deletePoll(relativeUrl);
            });
    });
});

describe('DELETE /api/v1/polls/:id', function() {
    it('deletes a poll when it exists', function() {
        var relativeUrl;
        return helpers.createPoll()
            .then(function(pollRelativeUrl) {
                relativeUrl = pollRelativeUrl;
                return request(app)
                    .del(pollRelativeUrl)
                    .expect(204);
            }).then(function() {
                return request(app)
                    .get(relativeUrl)
                    .expect(404);
            });
    });

    it('returns a 404 when it does not exist', function() {
        return request(app)
            .del('/api/v1/polls/0')
            .expect(404);
    });
});
