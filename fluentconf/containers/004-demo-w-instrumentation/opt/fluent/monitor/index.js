'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import trace from 'jstrace';

// TODO: there are several ways to detect the event loop delay, share them as snippets and discuss which one is a better indicator when.

// see: https://github.com/hapijs/good/blob/ecd705719777af5810dc224001940205cfebd2eb/lib/process.js#L14-L21
const INTERVAL = 100;

let start = (new Date()).getTime();
setInterval( () => {
    let time = process.hrtime();
    let time1 = (new Date()).getTime()
    let end = (new Date()).getTime();

    console.log( 'diff:', ( (end - start) - 100 ) );

    start = end;

    // process.nextTick( () => {
    //     let delta = process.hrtime(time);
    //
    //     trace( 'nextick:lag', delta[ 0 ] * 10e9+ delta[ 1 ] );
    //
    //     console.log( 'nexttick:lag', (delta[ 0 ] * 10e9 + delta[ 1 ])/(10e6) );
    // } );

    // setImmediate( () => {
    //     let time2 = (new Date()).getTime();
    //     let delta = process.hrtime(time);
    //     //
    //     // trace( 'eventloop:lag', delta[ 0 ] * 10e9+ delta[ 1 ] );
    //     //
    //     console.log( 'eventloop:lag', (delta[ 0 ] * 10e9 + delta[ 1 ])/(10e6) );
    //     //
    //     //console.log( 'eventloop:lag', time2-time1);
    // } );
}, INTERVAL );
