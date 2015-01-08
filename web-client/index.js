/* global document, require, window */
'use strict';

var $ = window.jQuery = require('jquery');
require('bootstrap');

var page = require('./pages');

$(document).ready(function() {
    page();
});
