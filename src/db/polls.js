/* global exports */
var polls = [
    {
        id: '1',
        questions: ['1', '2']
    }, {
        id: '2',
        questions: ['3']
    }
];

var questions = [
    {
        id: '1',
        content: 'What do you think of foo?',
        answers: ['1', '2', '3']
    }, {
        id: '2',
        content: 'What is 2 + 3?',
        answers: ['4', '5', '6']
    }, {
        id: '3',
        content: 'Is this awesome?',
        answers: ['7', '8']
    }
];

var answers = [
    {
        id: '1',
        content: 'I like it!'
    }, {
        id: '2',
        content: 'I\'m indifferent'
    }, {
        id: '3',
        content: 'I hate it!'
    }, {
        id: '4',
        content: '4'
    }, {
        id: '5',
        content: '5'
    }, {
        id: '6',
        content: '6'
    }, {
        id: '7',
        content: 'Yes'
    }, {
        id: '8',
        content: 'No'
    }
];

function clone(x) {
    return JSON.parse(JSON.stringify(x));
}

function realizePoll(poll) {
    poll = clone(poll);
    var mappedQuestions = poll.questions.map(function(questionId) {
        var question = clone(questions.filter(function(question) {
            return question.id == questionId;
        })[0]);
        var mappedAnswers = question.answers.map(function(answerId) {
            return answers.filter(function(answer) {
                return answer.id == answerId;
            })[0];
        });
        question.answers = mappedAnswers;
        return question;
    });
    poll.questions = mappedQuestions;
    return poll;
}

exports.getPolls = function() {
    return polls.map(realizePoll);
};

exports.getPoll = function(id) {
    return polls.filter(function(poll) {
        return poll.id == id;
    }).map(realizePoll)[0];
};
