'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import Vantage from 'vantage';
import { dumpHeap, dumpCore } from '../dump';
import { startInstrumenting, stopInstrumenting } from '../monitor';

let voidInformer = { inform: () => {} };
let informer = null;

/**
 *
 */
let inform = ( what ) => ( informer || voidInformer ).inform( what );

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
        .command( 'start-instrumenting' )
        .description( 'Starts gathering metrics.' )
        .action( function( args, callback ) {
            startInstrumenting();

            this.log( 'Started instrumenting.' );

            callback();
        } );

    vantage
        .command( 'stop-instrumenting' )
        .description( 'Stops gathering metrics.' )
        .action( function( args, callback ) {
            stopInstrumenting();

            this.log( 'Stopped instrumenting.' );

            callback();
        } );

    vantage
        .command( 'shutdown-server' )
        .description( 'Shuts down the server.' )
        .action( function( /*args, callback*/ ) {
            this.log( 'Forcefully shutting down the server.' );

            process.exit( 0 );
        } );

    vantage
        .command( 'toggle-logging' )
        .description( 'Toggles request logging.' )
        .action( function( args, callback ) {
            informer = informer ? null : this;

            this.log( 'Toggled logging.' );

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

    vantage.listen( 8015 );
};

export { inform, listen };
