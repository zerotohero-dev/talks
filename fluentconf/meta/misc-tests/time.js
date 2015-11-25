'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

/*
 * Poor man's high resolution stopwatch.
 */

var lastTime = 0;

exports.lap = function() {
    var hrTime = process.hrtime();
    var theTime = hrTime[0] * 1000000 + hrTime[1] / 1000;

    console.log( ( theTime - lastTime )  / 1000000 );

    lastTime = theTime;
};
