/* global exports */
'use strict';

/**
 * @param {!Request} req
 * @param {!string} relativeUrl
 */
exports.convertRelUrlToAbs = function(req, relativeUrl) {
    return req.protocol + '://' + req.headers.host + relativeUrl;
};

/**
 * @param {!Request} req
 * @param {!Response} res
 */
exports.sendPollNotFoundError = function(req, res) {
    res.format({
        'application/json': function() {
            res.statusCode = 404;
            res.send({
                type: exports.convertRelUrlToAbs(
                    req,
                    '/api/v1/errors/poll-not-found'
                ),
                title: 'Poll not found'
            });
        }
    });
};
