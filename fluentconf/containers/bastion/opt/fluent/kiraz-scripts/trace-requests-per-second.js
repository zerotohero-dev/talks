'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var chart = require( 'darth' );
var clear = require( 'clear' );

var requestCount = 0;
var POLL_INTERVAL = 1000;

function resetRequestCount() {requestCount = 0;}
function incrementRequestCount() {requestCount++;}

exports.local = function( traces ) {
    var data = [];

    traces.on( 'request:end', incrementRequestCount );

    setInterval( function() {
        data.push( requestCount );
        resetRequestCount();

        clear();

        console.log( ' REQUESTS PER SECOND ' );
        console.log( '+-------------------+' );
        console.log( chart( data ) );
    }, POLL_INTERVAL );

    console.log( 'Started listening…' );
};
