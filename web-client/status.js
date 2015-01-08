/* global document, module, require, setTimeout */
'use strict';

var _ = require('lodash');

function set(alertCssClass, message) {
    var element = document.getElementById('status');
    element.innerHTML =
        '<div class="alert alert-' + alertCssClass + '" role="alert">' +
        message + '</div>';
    return function() {
        element.innerHTML = '';
    };
}

function flash(alertCssClass, message) {
    var clear = set(alertCssClass, message);
    setTimeout(function() {
        clear();
    }, 3000);
}

var curriedSet = _.curry(set);
var curriedFlash = _.curry(flash);

module.exports.flashSuccess = curriedFlash('success');
module.exports.flashDanger = curriedFlash('danger');
module.exports.setInfo = curriedSet('info');
