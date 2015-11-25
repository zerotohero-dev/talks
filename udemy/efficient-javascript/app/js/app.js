/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
(function() {
    'use strict';

    requirejs.config({
        baseUrl : 'js/',
        paths : {
            jquery     : 'third-party/jquery',
            underscore : 'third-party/underscore',
            backbone   : 'third-party/backbone'
        },
        shim : {
            jquery : {
                exports : 'jQuery'
            },
            underscore : {exports : '_'},
            backbone : {
                deps    : ['underscore', 'jquery'],
                exports : 'Backbone'
            }
        }
    });

    require([
        'bootstrap'
    ], function(
        application
    ) {
        application.run();
    });
}());
