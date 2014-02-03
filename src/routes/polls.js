/* global exports, require */
var db = require('../db/polls');

function convertRelUrlToAbs(req, relativeUrl) {
    return req.protocol + '://' + req.headers.host + relativeUrl;
}

function sendPollNotFoundError(req, res) {
    res.format({
        'application/json': function() {
            res.statusCode = 404;
            res.send({
                type: convertRelUrlToAbs(req, '/errors/poll-not-found'),
                title: 'Poll not found'
            });
        }
    });
}

function resourceOperation(req, res, operation) {
    var poll = db.getPoll(req.param('pollId'));
    if(!poll) {
        sendPollNotFoundError(req, res);
    } else {
        operation(poll);
    }
}

exports.__convertRelUrlToAbs = convertRelUrlToAbs;

exports.index = function(req, res) {
    res.format({
        'application/json': function() {
            res.send(db.getPolls());
        }
    });
};

exports.get = function(req, res) {
    resourceOperation(req, res, function(poll) {
        res.format({
            'application/json': function() {
                res.send(poll);
            }
        });
    });
};

exports.put = function(req, res) {
    resourceOperation(req, res, function() {
        db.updatePoll(req.param('pollId'), req.body);
        res.send(204);
    });
};

exports.del = function(req, res) {
    resourceOperation(req, res, function() {
        db.deletePoll(req.param('pollId'));
        res.send(204);
    });
};
