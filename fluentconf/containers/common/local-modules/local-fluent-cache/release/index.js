'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _localFluentLogger = require('local-fluent-logger');

var _localFluentLogger2 = _interopRequireDefault(_localFluentLogger);

var _redis = require('redis');

var _memoryCache = require('memory-cache');

var THREE_HOURS = 3 * 1000 * 60 * 60;
var THREE_HOURS_IN_SECS = 3 * 60 * 60;

var cache = {};

if (process.env.REDIS_PORT) {
    (function () {
        console.log('cache: found redis; will use redis.');
        _localFluentLogger2['default'].info('cache: found redis; will use redis.');

        var client = (0, _redis.createClient)({ host: 'redis', port: 6379 });

        cache.put = function (key, value) {
            client.setex(key, THREE_HOURS_IN_SECS, typeof value === 'object' ? JSON.stringify(value) : value);
        };

        cache.get = function (key) {
            return new Promise(function (resolve /*, reject*/) {
                client.get(key, function (err, reply) {
                    resolve(JSON.parse(reply));
                });
            });
        };
    })();
} else {
    console.log('Cache: no redis found; falling back to in-memory cache.');
    _localFluentLogger2['default'].info('Cache: no redis found; falling back to in-memory cache.');

    cache.put = function (key, value) {
        return (0, _memoryCache.put)(key, value, THREE_HOURS);
    };
    cache.get = function (key) {
        return Promise.resolve((0, _memoryCache.get)(key));
    };
}

exports['default'] = {
    put: cache.put,
    get: cache.get
};
module.exports = exports['default'];
