'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import Vantage from 'vantage';
import { dumpHeap, dumpCore } from '../dump';
import { startInstrumenting, stopInstrumenting } from '../monitor';
import { startProfiling, stopProfiling, deleteAllProfiles } from 'v8-profiler';
import { createWriteStream } from 'fs';

const VANTAGE_PORT = 8004;

let nullInformer = { log: () => {} };
let informer = nullInformer;
let profilerRunning = false;

let inform = ( what ) => informer.log( what );

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
            informer = informer === nullInformer ? this : nullInformer;

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

    vantage
        .command( 'toggle-profiling' )
        .description( 'Toggles CPU profiling' )
        .action( function( args, callback ) {
            if ( profilerRunning ) {
                let profile = stopProfiling();

                this.log( 'Stopped profiling.' );

                profile
                    .export()
                    .pipe( createWriteStream( `/data/fluent-${Date.now()}.cpuprofile` ) )
                    .once( 'error',  deleteAllProfiles )
                    .once( 'finish', deleteAllProfiles );

                profilerRunning = false;

                callback();

                return;
            }

            startProfiling();
            profilerRunning = true;

            this.log( 'Started profiling.' );

            callback();
        } );

    vantage.listen( VANTAGE_PORT );

    console.log( `Vantage: Started listening at port "${VANTAGE_PORT}".` );
};

export { inform, listen };
