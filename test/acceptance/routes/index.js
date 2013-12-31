/* global describe, it, require */
var request = require('supertest');
var app = require('./../../../src/app');

describe('GET /', function() {
    it('responds as expected', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', 'text/plain')
            .expect(200, 'Hello world', done);
    });
});
