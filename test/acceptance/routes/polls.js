/* global describe, it, require */
var assert = require('assert');
var request = require('supertest');
var app = require('./../../../src/app');

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
                assert.equal(res.body.id, '1');
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
