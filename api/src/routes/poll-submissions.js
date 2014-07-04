/* global exports, require */
'use strict';

var polls = require('./../db/polls');
var utilities = require('../utilities');

exports.post = function(req, res) {
    var pollId = req.param('pollId');
    polls.getPoll(pollId, function(poll) {
        if(!poll) {
            utilities.sendPollNotFoundError(req, res);
        } else {
            res.send(200);
        }
    });
};
