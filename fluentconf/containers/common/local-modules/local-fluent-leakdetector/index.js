'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import profiler from 'gc-profiler';
import { dumpHeap } from 'local-fluent-dump';

/**
 *
 */
let init = () => {
    let usages = [];

    profiler.on( 'gc', ( info ) => {
        if ( info.type !== 'MarkSweepCompact' ) { return; }

        usages.push( process.memoryUsage().heapUsed );
        if ( usages.length > 5 ) { usages.shift(); }

        // If there a constant heap increase in the last 5 full garbage
        // collections, then we suspect a leak.
        // If the number are not constantly increasing, then the sorted
        // version would be different from the unsorted one.
        let leaking = usages.sort().toString() === usages.toString();

        if ( !leaking ) { return; }

        log.warn( 'The memory appears to be leaking; taking a heap snapshot.' );
        console.log( 'The memory appears to be leaking', usages );

        // TODO: fixme.
        //dumpHeap( () => {}, 'memoryLeak' );
    } );
};

export { init };
