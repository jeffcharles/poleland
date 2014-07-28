/* global exports, require */
'use strict';

var polls = require('./../db/polls');
var utilities = require('../utilities');

exports.post = function(req, res, next) {
    var pollId = req.param('pollId');
    polls.getPoll(pollId, function(err) {
        if(err) {
            if(err.type !== 'pollNotFound') {
                next(err);
            } else {
                utilities.sendPollNotFoundError(req, res);
            }
        } else {
            res.status(200).end();
        }
    });
};
