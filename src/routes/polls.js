/* global exports, require */
var db = require('../db/polls');

function convertRelUrlToAbs(req, relativeUrl) {
    return req.protocol + '://' + req.headers.host + relativeUrl;
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
                res.send({
                    type: convertRelUrlToAbs(req, '/errors/poll-not-found'),
                    title: 'Poll not found'
                });
            } else {
                res.send(poll);
            }
        }
    });
};

exports.put = function(req, res) {
    db.updatePoll(req.param('pollId'), req.body);
    res.statusCode = 204;
    res.send();
};
