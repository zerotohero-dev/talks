'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var chart = require( 'darth' );
var clear = require( 'clear' );

exports.local = function( traces ) {
    var data = [];
    var requestCount = 0;
    var POLL_INTERVAL = 1000;

    traces.on( 'request:end', function( result ) {
        requestCount++;
    } );

    setInterval( function() {
        data.push( requestCount );
        requestCount = 0;

        clear();
        console.log( ' REQUESTS PER SECOND ' );
        console.log( '+-------------------+' );
        console.log( chart( data ) );
    }, POLL_INTERVAL );

    console.log( 'Started listening…' );
};
