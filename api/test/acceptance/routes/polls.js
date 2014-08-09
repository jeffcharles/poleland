/* global after, before, describe, it, require */
'use strict';

var assert = require('assert');
var request = require('supertest');
var appContainer = require('./../../../src/app');
var helpers = require('./../helpers');

var app = appContainer.app;

before(function() {
    appContainer.start();
});

after(function() {
    appContainer.stop();
});

describe('POST /api/v1/polls', function() {
    it('creates a new poll', function(done) {
        request(app)
            .post('/api/v1/polls')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(helpers.poll)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect('Location', /^https?:\/\/.+\/api\/v1\/polls\/[A-Za-z0-9]+$/)
            .expect(201)
            .end(function(err, res) {
                if(err) {
                    done(err);
                    return;
                }
                var resPoll = res.body;
                delete resPoll._links;
                assert.deepEqual(resPoll, helpers.poll);

                var relativeUrl =
                    '/' + res.header.location.split('/').slice(3).join('/');
                request(app)
                    .get(relativeUrl)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200)
                    .end(function(err, res) {
                        if(err) {
                            done(err);
                            return;
                        }
                        var resPoll = res.body;
                        delete resPoll._links;
                        assert.deepEqual(resPoll, helpers.poll);
                        helpers.deletePoll(relativeUrl, done);
                    });
            });
    });
    it('validates the poll', function(done) {
        request(app)
            .post('/api/v1/polls')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ foo: 'bar' })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8', done);
    });
});

describe('GET /api/v1/polls', function() {
    it('returns a list of polls', function(done) {
        helpers.createTemporaryPoll(function(pollRelativeUrl, next) {
            request(app)
                .get('/api/v1/polls')
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200, next);
        }, done);
    });
});

describe('GET /api/v1/polls/:id', function() {
    it('returns a poll when it exists', function(done) {
        helpers.createTemporaryPoll(function(pollRelativeUrl, next) {
            request(app)
                .get(pollRelativeUrl)
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        next(err);
                        return;
                    }
                    assert.ok(
                        res.body._links.self.href.indexOf(
                            pollRelativeUrl) > -1);
                    next();
                });
        }, done);
    });
    it('returns a 404 when it does not exist', function(done) {
        request(app)
            .get('/api/v1/polls/0')
            .set('Accept', '*/*')
            .expect(404, done);
    });
});

describe('PUT /api/v1/polls/:id', function() {
    it('updates a poll when it exists', function(done) {
        helpers.createTemporaryPoll(function(pollRelativeUrl, next) {
            request(app)
                .put(pollRelativeUrl)
                .set('Content-Type', 'application/json; charset=utf-8')
                .send(helpers.poll)
                .expect(204)
                .end(function(err) {
                    if(err) {
                        next(err);
                        return;
                    }
                    request(app)
                        .get(pollRelativeUrl)
                        .set('Accept', 'application/json')
                        .expect('Content-Type',
                                'application/json; charset=utf-8')
                        .expect(200)
                        .end(function(err, res) {
                            if(err) {
                                next(err);
                                return;
                            }
                            var resPoll = res.body;
                            delete resPoll._links;
                            assert.deepEqual(resPoll, helpers.poll);
                            next();
                        });
                });
        }, done);
    });
    it('returns a 404 when it does not exist', function(done) {
        request(app)
            .put('/api/v1/polls/0')
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(helpers.poll)
            .expect(404, done);
    });
    it('validates the poll', function(done) {
        helpers.createTemporaryPoll(function(pollRelativeUrl, next) {
            request(app)
                .put(pollRelativeUrl)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({ foo: 'bar' })
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8',
                        next);
        }, done);
    });
});

describe('DELETE /polls/:id', function() {
    it('deletes a poll when it exists', function(done) {
        helpers.createPoll(function(pollRelativeUrl) {
            request(app)
                .del(pollRelativeUrl)
                .expect(204)
                .end(function(err) {
                    if(err) {
                        done(err);
                        return;
                    }
                    request(app)
                        .get(pollRelativeUrl)
                        .expect(404, done);
                });
        });
    });
    it('returns a 404 when it does not exist', function(done) {
        request(app)
            .del('/api/v1/polls/0')
            .expect(404, done);
    });
});
