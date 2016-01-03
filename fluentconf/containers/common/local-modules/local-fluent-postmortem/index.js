'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import { dumpHeap, dumpCore } from 'local-fluent-dump';
import { open as openCircuit } from 'local-fluent-circuit';

let die = () => {
    openCircuit();

    dumpCore( () => {}, 'unhandledRejection' );
    dumpHeap( () => {}, 'unhandledRejection' );

    // Wait for 10 seconds for the existing connections to close.
    setTimeout( () => process.exit( 1 ), 10000 );
};

/**
 *
 */
let init = () => {
    process.on('unhandledRejection', ( error, promise ) => {
        console.error( 'Unhandled Promise rejection detected.' );
        console.error( error );
        if ( error ) {
            console.error( error.stack );
        }
        console.error( promise );

        log.error( 'Unhandled Promise rejection detected.' );
        log.error( error );
        if ( error ) {
            log.error( error.stack );
        }
        log.error( promise );

        // No need to die on unhandled promise rejection because the promise
        // rejection may be due to some of the libraries that we are using
        // such as vorpal or vantage.
        // die();
    } );

    process.on('uncaughtException', ( error ) => {
        console.error( 'Unhandled exception detected.' );
        console.error( error );
        if ( error ) {
            console.error( error.stack );
        }
        console.info( 'Will dump core and exit.' );

        log.error( 'Unhandled exception detected.' );
        log.error( error );
        log.info( 'Will dump core and exit.' );

        die();
    } );
};

export { init };
