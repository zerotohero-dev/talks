'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { cpus as getCpus } from 'os';
import { assignedCpus } from '../config.json';

// `lookup` did not play well with a single-cpu container emulation.
// import { lookup } from 'usage';

/**
 *
 */
let getCpuAverage = () => {
    let totalIdle = 0, totalTick = 0;

    // Dirty hack ahead:
    //
    // The demo is configured to run on a certain subset of the CPU cores.
    // The remaining cores are irrelevant. Yet, since this is a
    // Docker container, there’s no way separating them apart.
    //
    // This hack just counts the CPU cores that we care about and ignores the
    // rest.
    assignedCpus.map( ( cpuNumber ) => {
        let cpu = getCpus()[ cpuNumber ];

        Object.keys( cpu.times ).forEach(
            ( type ) => totalTick += cpu.times[ type ]
        );

        totalIdle += cpu.times.idle;
    } );

    return { idle: totalIdle,  total: totalTick };
};

/**
 *
 */
let getMemoryUsage = () => process.memoryUsage();

export { getCpuAverage, getMemoryUsage };
