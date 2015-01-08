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
 * @param {!PollDoc} poll
 * @returns {!OutPoll}
 */
function preparePollForRes(req, poll) {
    poll._links = {
        'self': {
            'href': utilities.convertRelUrlToAbs(req,
                                                 '/api/v1/polls/' + poll.id)
        },
        'collection': {
            'href': utilities.convertRelUrlToAbs(req, '/api/v1/polls')
        }
    };
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
            db.getPolls(req.query.continueAfter, req.query.limit)
                .then(function(results) {
                    var polls = results.items.map(function(p) {
                        return preparePollForRes(req, p);
                    });
                    var body = { polls: polls };
                    if(results.continueAfter) {
                        var next = utilities.convertRelUrlToAbs(
                            req,
                            '/api/v1/polls?continueAfter=' +
                                results.continueAfter);
                        body._links = {
                            next: next
                        };
                    }
                    res.send(body);
                }).catch(function(err) {
                    next(err);
                });
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
            db.getPoll(req.params.pollId)
                .then(function(poll) {
                    preparePollForRes(req, poll);
                    res.send(poll);
                }).catch(function(err) {
                    if(db.isPollNotFoundError(err)) {
                        utilities.sendPollNotFoundError(req, res);
                    } else {
                        next(err);
                    }
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
            if(!tv4.validate(req.body, pollSchema)) {
                sendPollNotValidError(req, res, tv4.error);
                return;
            }
            db.createPoll(stripUnknownPollProperties(req.body))
                .then(function(poll) {
                    var selfUrl =
                            utilities.convertRelUrlToAbs(req,
                                                         '/api/v1/polls/' +
                                                         poll.id);
                    preparePollForRes(req, poll);
                    res.setHeader('Location', selfUrl);
                    res.status(201).send(poll);
                }).catch(function(err) {
                    next(err);
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
    db.getPoll(req.params.pollId)
        .then(function() {
            if(!tv4.validate(req.body, pollSchema)) {
                var err = new Error('Invalid poll');
                err.name = 'pollInvalid';
                throw err;
            }
            return db.updatePoll(
                req.params.pollId, stripUnknownPollProperties(req.body));
        }).then(function() {
            res.status(204).end();
        }).catch(function(err) {
            if(db.isPollNotFoundError(err)) {
                utilities.sendPollNotFoundError(req, res);
            } else if(err.name === 'pollInvalid') {
                sendPollNotValidError(req, res, tv4.error);
            } else {
                next(err);
            }
        });
};

/**
 * @param {!Request} req
 * @param {!Response} res
 * @param {!Function} next
 */
exports.del = function(req, res, next) {
    db.getPoll(req.params.pollId)
        .then(function() {
            return db.deletePoll(req.params.pollId);
        }).then(function() {
            res.status(204).end();
        }).catch(function(err) {
            if(db.isPollNotFoundError(err)) {
                utilities.sendPollNotFoundError(req, res);
            } else {
                next(err);
            }
        });
};
