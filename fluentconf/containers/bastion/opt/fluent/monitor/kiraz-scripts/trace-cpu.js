'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var chart = require( './chart' );
var clear = require( 'clear' );

exports.local = function( traces ) {
    var data = [];
    var POLL_INTERVAL = 1000;

    traces.on( 'cpu:utilization', function( result )  {
        data.push( result.usage );
    } );

    setInterval( function() {
        clear();
        console.log( ' CPU UTILIZATION ' );
        console.log( '+---------------+' );
        console.log( chart( data ) );
    }, POLL_INTERVAL );

    console.log( 'Started listening to CPU Utilization…' );
};
