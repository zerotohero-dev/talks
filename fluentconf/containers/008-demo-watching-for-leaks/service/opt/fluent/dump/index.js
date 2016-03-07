'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { gcore } from 'gcore';
import { writeSnapshot } from 'heapdump';

/**
 *
 */
let dumpHeap = ( done, prefix ) =>
    writeSnapshot( `/data/service-${prefix||''}-${(new Date()).getTime()}.heapsnapshot`, done );

/**
 *
 */
let dumpCore = ( done, prefix ) => {
    gcore( `/data/service-${prefix||''}-${(new Date()).getTime()}.core` );
    done();
};

export { dumpHeap, dumpCore };
