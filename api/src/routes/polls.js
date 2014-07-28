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
            }
        }
    },
    required: ['title', 'questions']
};

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

function resourceOperation(req, res, next, operation) {
    db.getPoll(req.param('pollId'), function(err, poll) {
        if(err) {
            if(err.type !== 'pollNotFound') {
                next(err);
            } else {
                utilities.sendPollNotFoundError(req, res);
            }
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
    delete poll._type;
    delete poll._version;
    return poll;
}

exports.index = function(req, res, next) {
    res.format({
        'application/json': function() {
            db.getPolls(function(err, polls) {
                if(err) {
                    next(err);
                    return;
                }
                polls = polls.map(function(p) {
                    return preparePollForRes(req, p);
                });
                res.send(polls);
            });
        }
    });
};

exports.get = function(req, res, next) {
    res.format({
        'application/json': function() {
            resourceOperation(req, res, next, function(poll) {
                preparePollForRes(req, poll);
                res.send(poll);
            });
        }
    });
};

exports.post = function(req, res, next) {
    res.format({
        'application/json': function() {
            validatePoll(req, res, function(uploadedPoll) {
                db.createPoll(uploadedPoll, function(err, poll) {
                    if(err) {
                        next(err);
                        return;
                    }
                    var selfUrl =
                            utilities.convertRelUrlToAbs(req,
                                                         '/api/v1/polls/' +
                                                         poll._id);
                    preparePollForRes(req, poll);
                    res.setHeader('Location', selfUrl);
                    res.status(201).send(poll);
                });
            });
        }
    });
};

exports.put = function(req, res, next) {
    resourceOperation(req, res, next, function() {
        validatePoll(req, res, function(uploadedPoll) {
            db.updatePoll(req.param('pollId'), uploadedPoll, function() {
                res.status(204).end();
            });
        });
    });
};

exports.del = function(req, res, next) {
    resourceOperation(req, res, next, function() {
        db.deletePoll(req.param('pollId'), function() {
            res.status(204).end();
        });
    });
};
