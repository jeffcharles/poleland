/* global describe, it, require */
'use strict';

var request = require('supertest-as-promised');
var app = require('./../../../src/app');

describe('GET /api/v1', function() {
    it('links to polls', function() {
        return request(app)
            .get('/api/v1')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(function(res) {
                var pollsUrlKey =
                    Object.keys(res.body._links).filter(function(rel) {
                        return rel.match(/\/api\/v1\/rels\/polls/);
                    })[0];
                var pollsUrl = res.body._links[pollsUrlKey].href;
                var relPollsUrl = '/' + pollsUrl.split('/').slice(3).join('/');
                return request(app)
                    .get(relPollsUrl)
                    .expect(200);
            });
    });
});
