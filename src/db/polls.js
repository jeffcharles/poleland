/* global exports */
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

exports.getPolls = function() {
    var ids = Object.keys(polls);
    return ids.map(getPollWithId);
};

exports.getPoll = function(id) {
    return getPollWithId(id);
};

exports.updatePoll = function(id, poll) {
    polls[id] = poll;
};
