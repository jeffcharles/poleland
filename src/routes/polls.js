/* global exports */
exports.index = function(req, res) {
    res.format({
        'application/json': function() {
            res.send([]);
        }
    });
};
