/* global describe, it, require */
var assert = require('assert');
var request = require('supertest');
var app = require('./../../../src/app');

var poll = {
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

describe('POST /polls', function() {
    it('creates a new poll', function(done) {
        request(app)
            .post('/polls')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(poll)
            .expect('Content-Type', 'application/json')
            .expect('Location', /^https?:\/\/.+\/polls\/\d+$/)
            .expect(201)
            .end(function(err, res) {
                if(err) {
                    return done(err);
                }
                var resPoll = res.body;
                delete resPoll._id;
                assert.deepEqual(resPoll, poll);

                var relativeUrl =
                    '/' + res.header.location.split('/').slice(3).join('/');
                request(app)
                    .get(relativeUrl)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .end(function(err, res) {
                        if(err) {
                            return done(err);
                        }
                        var resPoll = res.body;
                        delete resPoll._id;
                        assert.deepEqual(resPoll, poll);
                        done();
                    });
            });
    });
});

describe('GET /polls', function() {
    it('returns a list of polls', function(done) {
        request(app)
            .get('/polls')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(200, done);
    });
});

describe('GET /polls/:id', function() {
    it('returns a poll when it exists', function(done) {
        request(app)
            .get('/polls/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if(err) {
                    return done(err);
                }
                assert.equal(res.body._id, '1');
                done();
            });
    });
    it('returns a 404 when it does not exist', function(done) {
        request(app)
            .get('/polls/0')
            .set('Accept', '*/*')
            .expect(404, done);
    });
});

describe('PUT /polls/:id', function() {
    it('updates a poll when it exists', function(done) {
        request(app)
            .put('/polls/1')
            .set('Content-Type', 'application/json')
            .send(poll)
            .expect(204)
            .end(function(err) {
                if(err) {
                    return done(err);
                }
                request(app)
                    .get('/polls/1')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .end(function(err, res) {
                        if(err) {
                            return done(err);
                        }
                        var resPoll = res.body;
                        delete resPoll._id;
                        assert.deepEqual(resPoll, poll);
                        done();
                    });
            });
    });
    it('returns a 404 when it does not exist', function(done) {
        request(app)
            .put('/polls/0')
            .set('Content-Type', 'application/json')
            .send(poll)
            .expect(404, done);
    });
});

describe('DELETE /polls/:id', function() {
    it('deletes a poll when it exists', function(done) {
        request(app)
            .del('/polls/1')
            .expect(204)
            .end(function(err) {
                if(err) {
                    return done(err);
                }
                request(app)
                    .get('/polls/1')
                    .expect(404, done);
            });
    });
    it('returns a 404 when it does not exist', function(done) {
        request(app)
            .del('/polls/0')
            .expect(404, done);
    });
});
