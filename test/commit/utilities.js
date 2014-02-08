/* global describe, it, require */
var assert = require('assert');
var utilities = require('./../../src/utilities');

describe('#convertRelToAbs', function() {
    it('should convert a relative URL to an absolute URL', function() {
        var req = {
            protocol: 'http',
            headers: { host: 'foo.com:3000' }
        };
        var actual = utilities.convertRelUrlToAbs(req, '/bar');
        assert.equal(actual, 'http://foo.com:3000/bar');
    });
});
