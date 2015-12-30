'use strict';

//function bar() {
//    var stack = new Error().stack;
//    console.log( stack );
//
//}
//
//function foo() {
//    bar();
//}
//
//foo();

//var bar = function() {
//    var stack = new Error().stack;
//    console.log( stack );
//
//}
//
//var foo = function() {
//    bar();
//}
//
//foo();

require( 'babel-register' );
require( './test' );

//function a() {    var stack = new Error().stack;
//    console.log( stack );}
//function b() {    var stack = new Error().stack;
//    console.log( stack );}
//
//var bat = function() {
//    return Math.random() > 0.5 ? a : b;
//};
//
//var bar = function() {
//    (function () {
//        bat()();
//    }());
//};
//
//var foo = function() {
//    bar();
//}
//
//foo();
