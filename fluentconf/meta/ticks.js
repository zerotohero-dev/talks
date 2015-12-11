'use strict';

var fs = require('fs');
var path = require('path');

setTimeout(function() {
    setTimeout(function() {
        console.log('settimeout 1');
    }, 0);
    setTimeout(function() {
        console.log('settimeout 2');
    }, 0);
    setTimeout(function() {
        console.log('settimeout 3');
    }, 0);
    setTimeout(function() {
        console.log('settimeout 4');
    }, 0);
    setTimeout(function() {
        console.log('settimeout 5');
    }, 0);
    setTimeout(function() {
        console.log('settimeout 6');
    }, 0);
    setTimeout(function() {
        console.log('settimeout 7');
    }, 0);

    process.nextTick(function() {
        console.log('next tick 1');

        setImmediate(function() {
            console.log('immediate nt1');
        });
    });

    process.nextTick(function() {
        console.log('next tick 2');

        setImmediate(function() {
            console.log('immediate nt2');
        });
    });

    setImmediate(function() {
        console.log('immediate 1');
    });

    setTimeout(function() {
        console.log('settimeout 21');
    }, 0);

    setTimeout(function() {
        console.log('settimeout 22');
    }, 0);

    setImmediate(function() {
        console.log('immediate 2');
    });
}, 1000);

// setInterval(function() {
//     console.log('interval...');
//     setImmediate(function() {
//         console.log('immediate a');
//     });
//     setImmediate(function() {
//         console.log('immediate b');
//     });
// }, 1000)
