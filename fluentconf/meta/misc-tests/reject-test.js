
var Promise = require('bluebird').Promise;

function test() {
    var testPromise = new Promise( function( resolve, reject ) {
        setTimeout( function() {
            reject( 'dongi dongi' );
        }, 1000 );
    }  );

    return testPromise;
}

process.on('unhandledRejection', function( reason, promise ) {
    console.log( 'uhandled rejection.' );

    console.log( reason );

    console.log( promise );
} );

test();
