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
    db.getPoll(req.param('pollId'), function(poll) {
        if(!poll) {
            sendPollNotFoundError(req, res);
        } else {
            operation(poll);
        }
    });
}

exports.__convertRelUrlToAbs = convertRelUrlToAbs;

exports.index = function(req, res) {
    res.format({
        'application/json': function() {
            db.getPolls(function(polls) {
                res.send(polls);
            });
        }
    });
};

exports.get = function(req, res) {
    res.format({
        'application/json': function() {
            resourceOperation(req, res, function(poll) {
                res.send(poll);
            });
        }
    });
};

exports.post = function(req, res) {
    res.format({
        'application/json': function() {
            db.createPoll(req.body, function(poll) {
                res.setHeader('Location',
                              convertRelUrlToAbs(req, '/polls/' + poll._id));
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
