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
var delays = [];

exports.local = function( traces ) {
    traces.on( 'eventloop:delay', function( result )  {
        delays.push( result.delta );

        if ( delays.length >= 10 ) {
            delays.shift();
        }

        data.push( Math.max.apply( Math, delays ) );
    } );

    setInterval( function() {
        clear();
        console.log( ' EVENT LOOP DELAY ' );
        console.log( '+----------------+' );
        console.log( chart( data ) );
    }, POLL_INTERVAL );

    console.log( 'Started listening…' );
};
