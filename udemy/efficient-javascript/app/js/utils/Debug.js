/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

define([
    'core/Config'
], function(
    Config
){
    'use strict';

    function noop(){}
    function log(stuff) {console.log(stuff);}

    var result = {
        log     : log,
        trace   : log,
        warn    : function warn(stuff) {console.warn(stuff);},
        time    : function(timerId) {
            return console.time && console.time(timerId);
        },
        timeEnd : function timeEnd(timerId) {
            return console.timenEnd && console.timeEnd(timerId);
        }
    };

    if (Config.IS_PRODUCTION) {
        result.log = result.warn = noop;
    }

    if (Config.LOG_LEVEL < 2) {
        result.trace = noop;
    }

    return result;
});
