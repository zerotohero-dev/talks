'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import profiler from 'gc-profiler';
import { dumpHeap } from 'local-fluent-dump';

const MIN_DATASET_LENGTH_BEFORE_ALERTING = 5;

/**
 *
 */
let init = () => {
    let usages = [];

    profiler.on( 'gc', ( info ) => {
        if ( info.type !== 'MarkSweepCompact' ) { return; }

        usages.push( process.memoryUsage().heapUsed );

        if ( usages.length < MIN_DATASET_LENGTH_BEFORE_ALERTING ) { return; }

        // Five consecutive increases after full gc’s may suggest a memory leak.
        //
        // Note that this not the “only” way that the memory can leak.
        // There might be sneakier leaks that this algorithm might not catch.
        // Those leaks can only be detected by looking at the long-term
        // heap usage over time. — The algorithm here provides a quick and dirty
        // check which is “good enough” most of the time.

        let leaking = true;

        usages.reduce( ( acc, curr ) => {
            if ( acc > curr ) {
                leaking = false;
            }

            return curr;
        }, 0 );

        usages.length = 0;

        if ( leaking ) {
            log.warn( 'The memory appears to be leaking; taking a heap snapshot.', usages );
            console.log( 'The memory appears to be leaking; taking a heap snapshot.', usages );

            dumpHeap( () => {}, 'memoryLeak' );
        }
    } );
};

export { init };
