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

var _bouncy = require('bouncy');

var _bouncy2 = _interopRequireDefault(_bouncy);

var _fs = require('fs');

var _crypto = require('crypto');

var _localFluentLogger = require('local-fluent-logger');

var _localFluentLogger2 = _interopRequireDefault(_localFluentLogger);

var _localFluentCluster = require('local-fluent-cluster');

var mapping = {
    hosts: ['http://app1:80', 'http://app2:80'],
    currentIndex: 0
};

var init = function init() {
    (0, _localFluentCluster.init)(function () {}, function () {
        (0, _bouncy2['default'])(function (req, res, bounce) {
            if (!meta) {
                res.status(404).end('No such host.');

                return;
            }

            bounce(mapping.hosts[mapping.currentIndex]);

            mapping.currentIndex = mapping.currentIndex === mapping.hosts.length - 1 ? 0 : mapping.currentIndex + 1;
        }).listen(80);

        if (process.env.TERMINATE_SSL) {
            var selectSni = function selectSni(hostname) {
                var creds = {
                    key: (0, _fs.readFileSync)('/etc/ssl/private/' + hostname + '/private.key'),
                    cert: (0, _fs.readFileSync)('/etc/ssl/private/' + hostname + '/server.crt')
                };

                return (0, _crypto.createCredentials)(creds).context;
            };

            var ssl = {
                key: (0, _fs.readFileSync)('/etc/ssl/private/default.key'),
                cert: (0, _fs.readFileSync)('/etc/ssl/private/default.crt'),
                SNICallback: selectSni
            };

            (0, _bouncy2['default'])(ssl, function (req, bounce) {
                bounce(80);
            }).listen(443);
        }

        console.log('Load balancer initialized.');
        _localFluentLogger2['default'].info('Load balancer initialized');
    });
};

exports.init = init;
