/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

// Avoid infinite loops with unclear logic.

// avoid.
while( true ) {
    // logic…
}

// avoid.
for ( ;; ) {
    // logic…
}

// Actually always prefer Array.prototype.map/filter/reduce to loops.

// Other iteration tips:
//
// - Always use `Object.keys` to iterate over an object.
//
// - Don’t iterate parent prototype’s attributes. If you need to do so, then
// it’s time to rethink your architecture.
//
// - Avoid for...in loops in hot code paths as a rule of thumb.

// Cache inherited keys in an array and use it instead of re-traversing the
// prototoype chain over and over again.
// This way, you’ll do this expensive operation only once.
function getInheritedKeys( obj ) {
    var key;
    var ar = [];

    for ( key in obj ) {
        ar.push( key );
    }

    return ar;
}
