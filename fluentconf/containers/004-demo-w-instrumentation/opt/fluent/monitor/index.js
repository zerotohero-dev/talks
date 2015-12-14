'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { trace } from 'kiraz';
import { cpus as getCpus } from 'os';

// `lookup` did not play well with a single-cpu container emulation.
// import { lookup } from 'usage';

// Choosing a prime number for interval, because it's cool:
const INTERVAL = 467;

let cpuAverage = () => {
    let totalIdle = 0, totalTick = 0;

    // The demo is configured to run on the CPU #1.
    let cpu = getCpus()[1];

    for( let type in cpu.times ) {
        totalTick += cpu.times[ type ];
    }

    totalIdle += cpu.times.idle;

    return { idle: totalIdle,  total: totalTick };
}

let startMeasure = 0;
let counter = 0;

setInterval( () => {
    if ( counter % 23 === 0 ) {
        startMeasure = cpuAverage();
    } else {
        let endMeasure = cpuAverage();
        let idleDifference = endMeasure.idle - startMeasure.idle;
        let totalDifference = endMeasure.total - startMeasure.total;
        let percentageCPU = 100 - ~~( 100 * idleDifference / totalDifference );

        trace(
            'cpu:utilization',
            { usage: percentageCPU }
        );
    }
    counter++;

    let start = process.hrtime();

    setImmediate( () => {
        let delta = process.hrtime( start );

        trace(
            'eventloop:delay',
            { delta: ( ( delta[ 0 ] * 10e9 + delta[ 1 ] )  / ( 10e6 ) ) }
        );

        trace(
            'memory:usage',
            process.memoryUsage()
        );
    } );
}, INTERVAL );
