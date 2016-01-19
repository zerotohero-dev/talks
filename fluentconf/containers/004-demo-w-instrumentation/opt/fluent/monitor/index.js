'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { trace } from 'kiraz';
import { getCpuAverage, getMemoryUsage } from './metrics';

const INTERVAL = 467;

let startMeasure = 0;
let counter = 0;

let instrument = false;
let stopInstrumenting = () => instrument = false;
let startInstrumenting = () => instrument = true;

let serverBusy = false;
let isServerBusy = () => serverBusy;
let unsetBusy = () => serverBusy = false;

setInterval( () => {
    if ( !instrument ) { return; }

    {
        if ( counter % 23 === 0 ) {
            startMeasure = getCpuAverage();
        } else {
            let endMeasure = getCpuAverage();
            let idleDifference = endMeasure.idle - startMeasure.idle;
            let totalDifference = endMeasure.total - startMeasure.total;
            let percentageCPU = 100 - ~~( 100 * idleDifference / totalDifference );

            trace(
                'cpu:utilization',
                { usage: percentageCPU }
            );
        }

        counter++;
    }

    {
        let start = process.hrtime();

        setImmediate( () => {
            let delta = process.hrtime( start );

            let eventLoopDelayMs = (
                ( delta[ 0 ] * 1000 + delta[ 1 ] / 1000000 )
            );

            if ( eventLoopDelayMs > 300 ) {
                serverBusy = true;
            }

            trace(
                'eventloop:delay',
                { delta: eventLoopDelayMs }
            );

            trace(
                'memory:usage',
                { percent: getMemoryUsage() }
            );
        } );
    }
}, INTERVAL );

export { startInstrumenting, stopInstrumenting, isServerBusy, unsetBusy };
