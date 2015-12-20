'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var chart = require( 'darth' );
var clear = require( 'clear' );

var POLL_INTERVAL = 1000;
var data = [];

exports.local = function( traces ) {
    traces.on( 'memory:usage', function( result )  {
        data.push( result.percent.heapUsed / ( 1024 * 1024 ) );
    } );

    setInterval( function() {
        clear();
        console.log( ' MEMORY USAGE ' );
        console.log( '+-------------+' );
        console.log( chart( data ) );
    }, POLL_INTERVAL );

    console.log( 'Started listening…' );
};
