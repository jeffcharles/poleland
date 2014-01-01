/* global describe, it, require */
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
