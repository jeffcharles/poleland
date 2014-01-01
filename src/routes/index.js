/* global exports */
exports.index = function(req, res) {
    res.format({
        'text/plain': function() {
            res.send('Hello world');
        }
    });
};
