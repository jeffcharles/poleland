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

var bucket = 'poleland';
if(process.argv.length === 3) {
    bucket = process.argv[2];
}
var db =
        new couchbase.Connection({host: '10.0.0.2:8091', bucket: bucket});

var pollsForCb = {};
for(var pollId in polls) {
    pollsForCb['polls/' + pollId] = { value: polls[pollId] };
}
db.addMulti(pollsForCb, null, function(err, results) {
    var hasProblematicError = false;
    for(var id in results) {
        var result = results[id];
        if(result.error
           && result.error.code !== couchbase.errors.keyAlreadyExists) {
            console.log(result.error);
            hasProblematicError = true;
        } else if(!result.error) {
            console.log('Created document for ' + id);
        }
    }
    process.exit(hasProblematicError ? 1 : 0);
});
