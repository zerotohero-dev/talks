'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

exports.local = function( traces ) {
    traces.on( '*', function( n ) {
        console.log( 'hello', n );
    } );

    console.log( 'Started listening to all the things…' );
};
