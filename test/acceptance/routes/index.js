/* global describe, it, require */
var request = require('supertest');
var app = require('./../../../src/app');

describe('GET /', function() {
    it('responds as expected', function(done) {
        request(app)
            .get('/')
            .set('Accept', 'text/plain')
            .expect('Content-Type', 'text/plain; charset=UTF-8')
            .expect(200, 'Hello world', done);
    });
});
