'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var chart = require( './chart' );
var clear = require( 'clear' );

var data = [];

exports.local = function( traces ) {
    traces.on( 'eventloop:delay', function( result )  {
        data.push( result.delta );
    } );

    setInterval( function() {
        clear();
        console.log();
        console.log( '                                                                   EVENT LOOP DELAY' );
        console.log( '                                                                ——————————————————————' );
        console.log( chart( data ) );
    }, 1000 );

    console.log( 'Started listening to all the things…' );
};
