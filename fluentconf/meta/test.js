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

'use strict';

let Giant = () => {};

Giant.prototype.shout = () => {
    let stack = new Error().stack;
    console.log(stack);};

let a = () => {
    let g = new Giant();

    g.shout();
};

let b = () => {
    let g = new Giant();

    g.shout();
};



let bat = () => Math.random() > 0.5 ? a : b;

let bar = () => ( () => bat()() )();

let foo = () => bar();

foo();
