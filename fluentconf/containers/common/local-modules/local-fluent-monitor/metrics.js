'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { cpus as getCpus } from 'os';

// `lookup` did not play well with a single-cpu container emulation.
// import { lookup } from 'usage';

let getCpuAverage = () => {
    let totalIdle = 0, totalTick = 0;

    getCpus().forEach( ( cpu ) => {
        Object.keys( cpu.times ).forEach(
            ( type ) => totalTick += cpu.times[ type ]
        );

        totalIdle += cpu.times.idle;
    } );

    return { idle: totalIdle,  total: totalTick };
};

let getMemoryUsage = () => process.memoryUsage();

export { getCpuAverage, getMemoryUsage };
