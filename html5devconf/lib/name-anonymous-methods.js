/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

function createLargeClosure() {
    var largeStr = new Array(1000000).join('x');

    // This is NOT a named function
    // And it will be hard to detect it in a heap snapshot
    var bigBird = function() {
        return largeStr;
    };

    return bigBird;
}

function createLargeClosureNamed() {
    var largeStr = new Array(1000000).join('x');

    // This is better. It will be more visible in
    // the heap profiler, and it will be easier
    // to follow in the stack trace too.
    var bigBird = function bigBird() {
        return largeStr;
    };

    return bigBird;
}
