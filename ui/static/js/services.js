/* global angular */
angular.module('poleland.services', []).
    factory('polls', ['$http', '$q', function($http, $q) {
        'use strict';
        return {
            getPolls: function() {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: '/api/v1/polls'
                }).success(function(data) {
                    deferred.resolve(data.map(function(poll) {
                        return {
                            title: poll.title,
                            // double-encode since browser will decode once
                            anchorHref: encodeURIComponent(encodeURIComponent(
                                poll._links.self.href)),
                            href: encodeURIComponent(poll._links.self.href)
                        };
                    }));
                }).error(function(data, status) {
                    deferred.reject(status && status == 502 ?
                                    'ApiServerDown' : data);
                });
                return deferred.promise;
            },
            getPoll: function(pollHref) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    // single-decode since browser performs one decode
                    url: decodeURIComponent(pollHref)
                }).success(function(data) {
                    deferred.resolve(data);
                }).error(function(data, status) {
                    if(status) {
                        switch(status) {
                        case 404:
                            deferred.reject('NotFound');
                            return;
                        case 502:
                            deferred.reject('ApiServerDown');
                            return;
                        }
                    }
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            deletePoll: function(pollHref) {
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: decodeURIComponent(pollHref)
                }).success(function() {
                    deferred.resolve();
                }).error(function(data, status) {
                    if(status) {
                        switch(status) {
                        case 404:
                            deferred.reject('NotFound');
                            return;
                        case 502:
                            deferred.reject('ApiServerDown');
                            return;
                        }
                    }
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            savePoll: function(pollHref, poll) {
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: decodeURIComponent(pollHref),
                    data: poll
                }).success(function() {
                    deferred.resolve();
                }).error(function(data, status) {
                    if(status) {
                        switch(status) {
                        case 404:
                            deferred.reject('NotFound');
                            return;
                        case 502:
                            deferred.reject('ApiServerDown');
                            return;
                        }
                    }
                    deferred.reject(data);
                });
                return deferred.promise;
            }
        };
    }]);
