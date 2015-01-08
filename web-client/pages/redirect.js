/* globals module */
'use strict';

var redirectCallback;

module.exports.toHref = function(href) {
    redirectCallback(href);
};

module.exports.on = function(callback) {
    redirectCallback = callback;
};
