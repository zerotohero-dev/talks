'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { trace } from 'kiraz';

// Choosing a prime number for interval, because it's cool:
const INTERVAL = 467;

setInterval( () => {
    let start = process.hrtime();
    setImmediate( () => {
        let delta = process.hrtime(start);

        trace(
            'eventloop:delay',
            ( ( delta[ 0 ] * 10e9 + delta[ 1 ] )  / ( 10e6 ) )
        );

        trace(
            'memory:usage',
            process.memoryUsage()
        );
    } );
}, INTERVAL );
