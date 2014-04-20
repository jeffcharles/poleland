/* global exports, require */
'use strict';

var tv4 = require('tv4');
var db = require('../db/polls');
var utilities = require('../utilities');

var pollSchema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'Poll',
    description: 'A poll for Poleland',
    type: 'object',
    properties: {
        title: {
            description: 'The name of the poll',
            type: 'string'
        },
        questions: {
            description: 'The questions in the poll',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        description: 'An identifier of the question',
                        type: 'string'
                    },
                    content: {
                        description: 'The text of the question',
                        type: 'string'
                    },
                    answers: {
                        description: 'Answers for the question',
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    description: 'An identifier of the answer',
                                    type: 'string'
                                },
                                content: {
                                    description: 'The text of the answer',
                                    type: 'string'
                                }
                            },
                            required: ['id', 'content']
                        },
                        minItems: 1
                    }
                },
                required: ['id', 'content', 'answers']
            },
            minItems: 1
        }
    },
    required: ['title', 'questions']
};

function sendPollNotFoundError(req, res) {
    res.format({
        'application/json': function() {
            res.statusCode = 404;
            res.send({
                type: utilities.convertRelUrlToAbs(
                    req,
                    '/api/v1/errors/poll-not-found'
                ),
                title: 'Poll not found'
            });
        }
    });
}

function sendPollNotValidError(req, res, error) {
    res.format({
        'application/json': function() {
            res.statusCode = 400;
            res.send({
                type: utilities.convertRelUrlToAbs(
                    req,
                    '/api/v1/errors/poll-not-valid'
                ),
                title: 'Poll not valid',
                data: error
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

function stripUnknownPollProperties(poll) {
    return {
        title: poll.title,
        questions: poll.questions.map(function(q) {
            return {
                id: q.id,
                content: q.content,
                answers: q.answers.map(function(a) {
                    return {
                        id: a.id,
                        content: a.content
                    };
                })
            };
        })
    };
}

function validatePoll(req, res, operation) {
    var uploadedPoll = req.body;
    var valid = tv4.validate(uploadedPoll, pollSchema);
    if(!valid) {
        sendPollNotValidError(req, res, tv4.error);
    } else {
        operation(stripUnknownPollProperties(uploadedPoll));
    }
}

function preparePollForRes(req, poll) {
    poll._links = {
        'self': {
            'href': utilities.convertRelUrlToAbs(req,
                                                 '/api/v1/polls/' + poll._id)
        },
        'collection': {
            'href': utilities.convertRelUrlToAbs(req, '/api/v1/polls')
        }
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
            validatePoll(req, res, function(uploadedPoll) {
                db.createPoll(uploadedPoll, function(poll) {
                    var selfUrl =
                            utilities.convertRelUrlToAbs(req,
                                                         '/api/v1/polls/' +
                                                         poll._id);
                    preparePollForRes(req, poll);
                    res.setHeader('Location', selfUrl);
                    res.send(201, poll);
                });
            });
        }
    });
};

exports.put = function(req, res) {
    resourceOperation(req, res, function() {
        validatePoll(req, res, function(uploadedPoll) {
            db.updatePoll(req.param('pollId'), uploadedPoll, function() {
                res.send(204);
            });
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
