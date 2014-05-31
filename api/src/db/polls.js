/* global exports */
'use strict';

var polls = {
    '1': {
        title: 'Random stuff',
        questions: [
            {
                id: '1',
                content: 'What do you think of foo?',
                answers: [
                    {
                        id: '1',
                        content: 'I like it!'
                    },
                    {
                        id: '2',
                        content: 'I\'m indifferent'
                    },
                    {
                        id: '3',
                        content: 'I hate it!'
                    }
                ]
            },
            {
                id: '2',
                content: 'What is 2 + 3?',
                answers: [
                    {
                        id: '1',
                        content: '4'
                    },
                    {
                        id: '2',
                        content: '5'
                    },
                    {
                        id: '3',
                        content: '6'
                    }
                ]
            }
        ]
    },
    '2': {
        title: 'Awesomeness measurements',
        questions: [
            {
                id: '1',
                content: 'Is this awesome?',
                answers: [
                    {
                        id: '1',
                        content: 'Yes'
                    },
                    {
                        id: '2',
                        content: 'No'
                    }
                ]
            }
        ]
    }
};

function clone(x) {
    return JSON.parse(JSON.stringify(x));
}

function getPollWithId(id) {
    var poll = polls[id];
    if(!poll) {
        return poll;
    }
    var clonedPoll = clone(poll);
    clonedPoll._id = id;
    return clonedPoll;
}

exports.getPolls = function(callback) {
    var ids = Object.keys(polls);
    callback(ids.map(getPollWithId));
};

exports.createPoll = function(poll, callback) {
    var parseInt2 = function(s) {
        return parseInt(s, 10);
    };
    var ids = Object.keys(polls).map(parseInt2);
    ids.sort(function(x, y) { return x - y; });
    var highestId = ids.pop();
    var assignedId = (highestId + 1).toString();
    polls[assignedId] = poll;
    callback(getPollWithId(assignedId));
};

exports.getPoll = function(id, callback) {
    callback(getPollWithId(id));
};

exports.updatePoll = function(id, poll, callback) {
    polls[id] = poll;
    callback();
};

exports.deletePoll = function(id, callback) {
    delete polls[id];
    callback();
};
