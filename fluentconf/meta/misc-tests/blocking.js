'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

/*
 * Simulates a blocking operation.
 */

exports.run = function() {
    var i = 0;
    var n = 10000000;
    var result = 0;

    for ( i = 0; i < n; i++ ) {
        if ( i % 1000000 === 0 ) {
            // Commented out because extensively writing to stdout can create
            // unreliable benchmark results.
            //
            // console.log( i );
        }

        result += Math.pow( Math.random(), Math.random() ) * i;
    }

    return result;
};
