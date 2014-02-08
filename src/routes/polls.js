/* global exports, require */
var db = require('../db/polls');
var utilities = require('../utilities');

function sendPollNotFoundError(req, res) {
    res.format({
        'application/json': function() {
            res.statusCode = 404;
            res.send({
                type: utilities.convertRelUrlToAbs(req,
                                                   '/errors/poll-not-found'),
                title: 'Poll not found'
            });
        }
    });
}

function resourceOperation(req, res, operation) {
    db.getPoll(req.param('pollId'), function(poll) {
        if(!poll) {
            sendPollNotFoundError(req, res);
        } else {
            operation(poll);
        }
    });
}

function preparePollForRes(req, poll) {
    poll._links = {
        'self': {
            'href': utilities.convertRelUrlToAbs(req, '/polls/' + poll._id)
        },
        'collection': { 'href': utilities.convertRelUrlToAbs(req, '/polls') }
    };
    delete poll._id;
    return poll;
}

exports.index = function(req, res) {
    res.format({
        'application/json': function() {
            db.getPolls(function(polls) {
                polls = polls.map(function(p) {
                    return preparePollForRes(req, p);
                });
                res.send(polls);
            });
        }
    });
};

exports.get = function(req, res) {
    res.format({
        'application/json': function() {
            resourceOperation(req, res, function(poll) {
                preparePollForRes(req, poll);
                res.send(poll);
            });
        }
    });
};

exports.post = function(req, res) {
    res.format({
        'application/json': function() {
            db.createPoll(req.body, function(poll) {
                var selfUrl =
                    utilities.convertRelUrlToAbs(req, '/polls/' + poll._id);
                preparePollForRes(req, poll);
                res.setHeader('Location', selfUrl);
                res.send(201, poll);
            });
        }
    });
};

exports.put = function(req, res) {
    resourceOperation(req, res, function() {
        db.updatePoll(req.param('pollId'), req.body, function() {
            res.send(204);
        });
    });
};

exports.del = function(req, res) {
    resourceOperation(req, res, function() {
        db.deletePoll(req.param('pollId'), function() {
            res.send(204);
        });
    });
};
