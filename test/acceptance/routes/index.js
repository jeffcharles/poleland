/* global describe, it, require */
var request = require('supertest');
var app = require('./../../../src/app');

describe('GET /', function() {
    it('links to polls', function(done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if(err) {
                    return done(err);
                }
                var pollsUrlKey =
                    Object.keys(res.body._links).filter(function(rel) {
                        return rel.match(/\/rels\/polls/);
                    })[0];
                var pollsUrl = res.body._links[pollsUrlKey].href;
                var relPollsUrl = '/' + pollsUrl.split('/').slice(3).join('/');
                request(app)
                    .get(relPollsUrl)
                    .expect(200, done);
            });
    });
});
