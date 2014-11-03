/* global exports, require */
'use strict';

var polls = require('./../db/polls');
var utilities = require('../utilities');

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 */
exports.post = function(req, res, next) {
    polls.getPoll(req.param('pollId'))
        .then(function() {
            res.status(200).end();
        }).fail(function(err) {
            if(err.name === 'pollNotFound') {
                utilities.sendPollNotFoundError(req, res);
            } else {
                next(err);
            }
        })
        .done();
};
