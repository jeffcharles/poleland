/* global module, require */
'use strict';

var reflux = require('reflux');

module.exports = reflux.createActions([
    'answerAddCanceled',
    'answerAddChanged',
    'answerAddStart',
    'answerAddDone',
    'answerDeleted',
    'answerMovedDown',
    'answerMovedUp',
    'pollCreateStarted',
    'pollLoaded',
    'pollsLoaded',
    'pollsMoreLoaded',
    'questionAddCanceled',
    'questionAddChanged',
    'questionAddDone',
    'questionAddStarted',
    'questionDeleted',
    'questionEdited',
    'questionEditingDone',
    'titleChanged',
    'titleChangeDone',
    'titleChangeStarted'
]);
