/* global exports, require */
var utilities = require('../utilities');

exports.index = function(req, res) {
    res.format({
        'application/json': function() {
            var pollsRel =
                    utilities.convertRelUrlToAbs(req, '/api/v1/rels/polls');
            var pollsUrl = utilities.convertRelUrlToAbs(req, '/api/v1/polls');
            var links = {};
            links[pollsRel] = { href: pollsUrl };
            res.send({
                _links: links
            });
        }
    });
};
