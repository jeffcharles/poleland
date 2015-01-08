/* global module, require */
'use strict';

var $ = require('jquery');

module.exports =
    $.get('/api/v1')
    .then(function(res) {
        var rels = res._links;
        var trimmedRels = {};
        Object.getOwnPropertyNames(rels).forEach(function(rel) {
            var trimmedRel = rel.replace(/.*\/api\/v1\/rels\//, '');
            trimmedRels[trimmedRel] = rels[rel];
        });
        return trimmedRels;
    });
