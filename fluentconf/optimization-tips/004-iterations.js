/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

// if you delete properties from an object, or add too many properties
// dynamically (outside constructor) or use properties that cannot be valid
// identifiers, then the object will degrade into dictionary mode (instead of
// having a C class as a backing data structure it will have a hashtable.
// using these objects in for in loops will be slower.

function doNotForEachArrays() {
    var ar = [1,2,3];
    var key;

    // This for loop will be deoptimized.
    for ( key in ar ) {
        ;
    }
}

function doNotForEachAnArrayLikeObject() {
    var ar = { '1': 1, '2': 2, '3': 3};
    var key;

    // This for loop will be deoptimized as well.
    for ( key in ar ) {
        ;
    }
}

function doNotUseSpecialKeywordsAsKeys() {
    // If it is not a legitimate variable name, then do not use it as a key.

    // `finally` and `delete` are keywords; `42is` is not a valid variable name.
    var ar = { 'finally': true, 'delete': false, '42is': 'life' };
    var key;

    // Will be deoptimized.
    for ( key in ar ) {
        ;
    }
}

function mayBeDeoptimized() {
    var ar = { foo: 11, bar: 12 };
    var key;

    delete ar.foo;

    // Changing the structure of the object after creation
    // may deoptimize the iteration.
    for ( key in ar ) {
        ;
    }
}
