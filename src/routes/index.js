/* global exports */
exports.index = function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Hello world');
};
