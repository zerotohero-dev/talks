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

        let leaking = usages.sort().toString() !== usages.toString();

        if ( !leaking ) { return; }

        log.warn( 'The memory appears to be leaking; taking a heap snapshot.' );
        dumpHeap( () => {}, 'memoryLeak' );
    } );
};

export { init };
