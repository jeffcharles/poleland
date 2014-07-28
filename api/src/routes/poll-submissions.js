/* global exports, require */
'use strict';

var polls = require('./../db/polls');
var utilities = require('../utilities');

exports.post = function(req, res, next) {
    var pollId = req.param('pollId');
    polls.getPoll(pollId, function(err) {
        if(err) {
            if(err.name === 'pollNotFound') {
                utilities.sendPollNotFoundError(req, res);
            } else {
                next(err);
            }
        } else {
            res.status(200).end();
        }
    });
};
