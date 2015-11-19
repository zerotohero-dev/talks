'use strict';

/*
 * Demonstrates how child_process does a fair allocation of CPU cycles.
 *
 * To properly run this test, make sure your container is allowed to use a
 * single cpu only:
 *
 *     docker run --cpuset-cpus="0" -i -t -v "${DIR}/containers\
 *         /service/opt/fluent":/opt/fluent fluent:service /bin/bash
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
