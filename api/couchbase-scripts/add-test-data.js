/* global console, process, require */
'use strict';
var couchbase = require('couchbase');

var polls = {
    '1': {
        _type: 'poll',
        _version: 1,
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
        _type: 'poll',
        _version: 1,
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

var db =
        new couchbase.Connection({host: '10.0.0.2:8091', bucket: 'poleland'});

var pollsForCb = {};
for(var pollId in polls) {
    pollsForCb['polls/' + pollId] = { value: polls[pollId] };
}
db.addMulti(pollsForCb, null, function(err) {
    if(err) {
        console.log(err);
    }
    process.exit(err ? 1 : 0);
});
