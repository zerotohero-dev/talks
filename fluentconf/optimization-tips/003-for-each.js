/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

function cannotReferenceKeyFromClosure() {
    var obj = {};
    var key;

    for (key in obj) {
        ;
    }

    return function() {

        // This will cause the outer function to be deoptimized.
        return key;
    };
}

var key;
function cannotUseKeyFromUpperScope() {
    var obj = {};

    // This will cause the entire function to be deoptimized.
    for ( key in obj ) {
        ;
    }
}
