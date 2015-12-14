'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var chart = require( './chart' );
var clear = require( 'clear' );

var data = [];

// exports.local = function( traces ) {
//     traces.on( 'cpu:utilization', function( result )  {
//         data.push( result.usage );
//     } );
//
//     // traces.on( 'eventloop:delay', function( result )  {
//     //     data.push( result.delta );
//     // } );
//
//     setInterval( function() {
//         clear();
//         console.log();
//         console.log( '                                                                   CPU UTILIZATION' );
// //        console.log( '                                                                   EVENT LOOP DELAY' );
//         console.log( '                                                                ——————————————————————' );
//         console.log( chart( data ) );
//     }, 1000 );
//
//     console.log( 'Started listening to all the things…' );
// };

var cache = {};
var maxDelta = 0;
var delays = [];

exports.local = function( traces ) {
    traces.on( 'cpu:utilization', function( result )  {
        cache.cpuUsage = '       CPU usage: ' + result.usage + '%';
    } );

    traces.on( 'eventloop:delay', function( result )  {
        delays.push( result.delta );

        if ( delays.length >= 10 ) {
            delays.shift();
        }

        maxDelta = Math.max.apply( Math, delays );

        cache.eventLoopDelay = 'Event loop delay: ' + maxDelta + 'ms.';
    } );

    setInterval( function() {
        clear();
        console.log();
        console.log();
        console.log('\t\t' + cache.cpuUsage);
        console.log();
        console.log('\t\t' + cache.eventLoopDelay);
    }, 100 );

    console.log( 'Started listening to all the things…' );
};
