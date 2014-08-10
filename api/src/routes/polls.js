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

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!object} error
 */
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

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 * @param {!Function} operation
 */
function resourceOperation(req, res, next, operation) {
    db.getPoll(req.param('pollId'))
        .then(function(poll) {
            operation(poll);
        }).fail(function(err) {
            if(err.name === 'pollNotFound') {
                utilities.sendPollNotFoundError(req, res);
            } else {
                next(err);
            }
        })
        .done();
}

/**
 * @param {!UserEnteredPoll} poll
 * @returns {!RawPoll}
 */
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

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} operation
 */
function validatePoll(req, res, operation) {
    var uploadedPoll = req.body;
    var valid = tv4.validate(uploadedPoll, pollSchema);
    if(!valid) {
        sendPollNotValidError(req, res, tv4.error);
    } else {
        operation(stripUnknownPollProperties(uploadedPoll));
    }
}

/**
 * @param {!Request} req
 * @param {!PollDoc} poll
 * @returns {!OutPoll}
 */
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

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 */
exports.index = function(req, res, next) {
    res.format({
        'application/json': function() {
            db.getPolls()
                .then(function(polls) {
                    polls = polls.map(function(p) {
                        return preparePollForRes(req, p);
                    });
                    res.send(polls);
                }).fail(function(err) {
                    next(err);
                })
                .done();
        }
    });
};

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 */
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

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 */
exports.post = function(req, res, next) {
    res.format({
        'application/json': function() {
            validatePoll(req, res, function(uploadedPoll) {
                db.createPoll(uploadedPoll)
                    .then(function(poll) {
                        var selfUrl =
                            utilities.convertRelUrlToAbs(req,
                                                         '/api/v1/polls/' +
                                                         poll._id);
                        preparePollForRes(req, poll);
                        res.setHeader('Location', selfUrl);
                        res.status(201).send(poll);
                    }).fail(function(err) {
                        next(err);
                    })
                    .done();
            });
        }
    });
};

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 */
exports.put = function(req, res, next) {
    resourceOperation(req, res, next, function() {
        validatePoll(req, res, function(uploadedPoll) {
            db.updatePoll(req.param('pollId'), uploadedPoll)
                .then(function() {
                    res.status(204).end();
                }).fail(function(err) {
                    next(err);
                })
                .done();
        });
    });
};

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 */
exports.del = function(req, res, next) {
    resourceOperation(req, res, next, function() {
        db.deletePoll(req.param('pollId'))
            .then(function() {
                res.status(204).end();
            }).fail(function(err) {
                next(err);
            })
            .done();
    });
};
