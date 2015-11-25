/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
function square(x) {
    return x * x;
}

function f_(x) {
    var sum = 0;

    for (var i = 0; i < x; i++) {

        // Calling functions in a for loop is expensive?
        // Not always. Depends on your engine.
        sum += square(i);
    }
    return sum;
}

function f(x) {
    var sum = 0;

    for (var i = 0; i < x; i++) {
        sum += (x * x);
    }

    return sum;
}
