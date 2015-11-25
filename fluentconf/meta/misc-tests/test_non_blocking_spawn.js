'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

/*
 * Demonstrates how child_process does a fair allocation of CPU cycles.
 *
 * To properly run this test, make sure your container is allowed to use a
 * single cpu only:
 *
 *     docker run --cpuset-cpus="0" -i -t -v "${DIR}/containers\
 *         /service/opt/fluent":/opt/fluent fluent:service /bin/bash
 */

/*
 * The output will be unpredictable because each `child_process.spawn` will
 * spawn a fresh instance of a V8 engine (assume ~30ms of latency, and some
 * extra memory usage — You cannot spawn thousands of processes; it's an
 * expensive operation).
 */

var time = require( './time' );
var spawn = require( 'child_process').spawn;

time.lap();

var cmd = spawn( 'node', [ 'block.js' ] );
cmd.stdout.on( 'data', function( data ) {
    console.log( 'a', data.toString() );
} );
cmd.on( 'close', function() {
    console.log( 'a' );

    time.lap();
} );

cmd = spawn( 'node', [ 'block.js' ] );
cmd.stdout.on( 'data', function( data ) {
    console.log( 'b', data.toString() );
} );
cmd.on( 'close', function() {
    console.log( 'b' );

    time.lap();
});

cmd = spawn( 'node', [ 'block.js' ] );
cmd.stdout.on( 'data', function( data ) {
    console.log( 'c', data.toString() );
} );
cmd.on( 'close', function() {
    console.log( 'c' );

    time.lap();
} );
