/* global describe, it, require */
var request = require('supertest');
var app = require('./../../../src/app');

describe('GET /polls', function() {
    it('returns an empty list of polls', function(done) {
        request(app)
            .get('/polls')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, '[]', done);
    });
});
