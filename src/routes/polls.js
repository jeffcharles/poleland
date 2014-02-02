/* global exports, require */
var db = require('../db/polls');

function convertRelUrlToAbs(req, relativeUrl) {
    return req.protocol + '://' + req.headers.host + relativeUrl;
}

function createPollNotFoundError(req) {
    return {
        type: convertRelUrlToAbs(req, '/errors/poll-not-found'),
        title: 'Poll not found'
    };
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
    var poll = db.getPoll(req.param('pollId'));
    res.format({
        'application/json': function() {
            if(!poll) {
                res.statusCode = 404;
                res.send(createPollNotFoundError(req));
            } else {
                res.send(poll);
            }
        }
    });
};

exports.put = function(req, res) {
    var poll = db.getPoll(req.param('pollId'));
    if(!poll) {
        res.format({
            'application/json': function() {
                res.statusCode = 404;
                res.send(createPollNotFoundError(req));
            }
        });
    } else {
        db.updatePoll(req.param('pollId'), req.body);
        res.statusCode = 204;
        res.send();
    }
};

exports.del = function(req, res) {
    db.deletePoll(req.param('pollId'));
    res.statusCode = 204;
    res.send();
};
