/* global exports */
exports.convertRelUrlToAbs = function(req, relativeUrl) {
    return req.protocol + '://' + req.headers.host + relativeUrl;
};
