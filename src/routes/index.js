/* global exports, require */
'use strict';

var utilities = require('../utilities');

/**
 * @param {!Request} req
 * @param {!Response} res
 */
exports.index = function(req, res) {
    res.format({
        'application/json': function() {
            var pollRel =
                    utilities.convertRelUrlToAbs(req, '/api/v1/rels/poll');
            var pollUrl =
                    utilities.convertRelUrlToAbs(req, '/api/v1/polls/{id}');
            var pollsRel =
                    utilities.convertRelUrlToAbs(req, '/api/v1/rels/polls');
            var pollsUrl = utilities.convertRelUrlToAbs(req, '/api/v1/polls');
            var links = {};
            links[pollRel] = { href: pollUrl, templated: true };
            links[pollsRel] = { href: pollsUrl };
            res.send({
                _links: links
            });
        }
    });
};
