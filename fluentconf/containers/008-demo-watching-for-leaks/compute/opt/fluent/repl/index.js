'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { dumpHeap, dumpCore } from '../dump';
import Vantage from 'vantage';

/**
 *
 */
let listen = () => {
    let vantage = new Vantage();

    vantage
        .command( 'ping' )
        .description( 'Checks vantage.' )
        .action( function( args, callback ) {
            this.log( 'pong.' );

            callback();
        } );

    vantage
        .command( 'dump' )
        .description( 'Takes a core dump.' )
        .action( function( args, callback ) {
            this.log( 'Will take a core dump…' );

            let self = this;

            dumpCore( () => {
                self.log( 'Core dumped.' );

                callback();
            } );


        } );

    vantage
        .command( 'snapshot' )
        .description( 'Takes a heap snapshot' )
        .action( function( args, callback ) {
            this.log( 'Will take a heap snapshot…' );

            let self = this;

            dumpHeap( () => {
                self.log( 'Heap snapshot taken.' );

                callback();
            } );
        } );

    vantage.listen( 8014 );
};

export { listen };
