'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var get = require('request' ).get;

function getUrl( url ) {
    get( url, function( err, response, body ) {
        // console.log( body );
        void body;
        console.log( '1' );

        setTimeout( function() { getUrl( url ) }, 100 );
    } );

    get( url, function( err, response, body ) {
        // console.log( body );
        void body;
        console.log( '2' );
    } );

    get( url, function( err, response, body ) {
        // console.log( body );
        void body;
        console.log( '3' );
    } );
}

var TAGS_URL = 'http://app:8003/benchmark/get-tags';

getUrl( TAGS_URL );

console.log( 'Started.' );

