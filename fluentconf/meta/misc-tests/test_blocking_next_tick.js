'use strict';

/*
 * Blocking call test (with process.nextTick).
 *
 * To properly run this test, make sure your container is allowed to use a
 * single cpu only:
 *
 *     docker run --cpuset-cpus="0" -i -t -v "${DIR}/containers\
 *         /service/opt/fluent":/opt/fluent fluent:service /bin/bash
 *
 */

var blocking = require( './blocking' );
var time = require( './time' );

time.lap();
process.nextTick( function() {
    blocking.run();
} );
process.nextTick( function() {
    blocking.run();
} );
process.nextTick( function() {
    blocking.run();
} );
process.nextTick( function() {
    time.lap();
} );

/*
Typical Output:
    2749.472079546
    0
    1000000
    2000000
    3000000
    4000000
    5000000
    6000000
    7000000
    8000000
    9000000
    0
    1000000
    2000000
    3000000
    4000000
    5000000
    6000000
    7000000
    8000000
    9000000
    0
    1000000
    2000000
    3000000
    4000000
    5000000
    6000000
    7000000
    8000000
    9000000
    4.360759678999901
 */
