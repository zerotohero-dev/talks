/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

// Do not return, pass, or leak the `arguments` object anywhere.

function badSlice() {

    // Passing `arguments` object.
    return Array.prototype.slice( arguments );
}

function goodSlice() {
    var ar = new Array( arguments.length );
    var i, len;

    for ( i = 0, len = ar.length; i < len; i++ ) {
        ar[ i ] = arguments[ i ];
    }

    return ar;
}

// Some uses of arguments object might cause optimization opt-outs.
// Indeed, do not use the `arguments` object if you don’t absolutely have to.
