/* global exports, require */
var db = require('../db/polls');

exports.index = function(req, res) {
    res.format({
        'application/json': function() {
            res.send(db.getPolls());
        }
    });
};
