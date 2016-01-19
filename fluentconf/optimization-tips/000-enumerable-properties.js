/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

function Demo() {}

// Do not define enumerable properties in the prototype chain.
// Defining enumerable properties in the prototype chain
// will affect all objects.
Demo.prototype.baz = function() {};

console.log( Demo.prototype.propertyIsEnumerable( 'baz' ) ); // true

// Use Object.defineProperty instead.
Object.defineProperty( Demo.prototype, 'baz', {
    enumerable: false,
    value: function() {}
} );
