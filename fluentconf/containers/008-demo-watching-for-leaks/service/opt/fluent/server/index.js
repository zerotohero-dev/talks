'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import bodyParser from 'body-parser';
import express from 'express';
import log from '../logger';
import profiler from 'gc-profiler';
import schema from '../schema';
import { dumpHeap, dumpCore } from '../dump';
import { graphql } from 'graphql';
import { listen, inform } from '../repl';
import { trace, start } from 'kiraz';

const MONITOR_ENDPOINT = '192.168.99.100';
const MONITOR_PORT = 4322;
const PORT = 8005;

let circuitOpen = false;

start( {
    host: MONITOR_ENDPOINT,
    port: MONITOR_PORT
} );

let app = express();

{
    let query = ( schema, request, response ) => graphql( schema, request.body )
        .then( ( result ) =>
            response.end( JSON.stringify( result, null, 4 ) )
        ).catch( ( error ) => {
            log.error( error, 'Error occurred while executing graphql query.' );

            response.end( 'error' );
        } );

    let tracker = ( req, res, next ) => {
        inform( `[${req.METHOD}] ${req.url}` );

        trace( 'request:start', req.url );

        res.on( 'end', () => {
            trace( 'request:end', req.url );
        } );

        next();
    };

    app.use( tracker );
    app.use( bodyParser.text( { type: 'application/graphql' } ) );

    app.post( '/api/v1/graph', ( req, res ) => {
        if ( circuitOpen ) {
            res
                .status(500)
                .send(
                    JSON.stringify( {
                        error: true,
                        description: 'I cannot handle your request right now because the service is shutting down.'
                    } )
                );

            return;
        }

        query( schema, req, res );
    } );

    app.get( '/benchmark/get-tags', ( req, res ) => {
        if ( circuitOpen ) {
            res
                .status(500)
                .send( JSON.stringify( {
                    error: true,
                    description: 'I cannot handle your request right now because the service is shutting down.'
                } )
            );

            return;
        }

        void req;

        let request = {
            body: `{ tags(
                url: "http://web:8080/` +
                `10-tricks-to-appear-smart-during-meetings-27b489a39d1a.html"
            ) }`
        };

        query( schema, request, res );
    } );

    app.get( '/benchmark/get-urls', ( req, res ) => {
        if ( circuitOpen ) {
            res
                .status(500)
                .send(
                    JSON.stringify( {
                        error: true,
                        description: 'I cannot handle your request right now because the service is shutting down.'
                    } )
                );

            return;
        }

        void req;

        let request = {
            body: `{
                urls(tag: "tech")
            }`
        };

        query( schema, request, res );
    } );
}

{
    let die = () => {
        circuitOpen = true;
        dumpCore( () => {}, 'unhandledRejection' );
        dumpHeap( () => {}, 'unhandledRejection' );

        // Wait for 10 seconds for remaining connections to close.
        setTimeout( () => process.exit( 1 ), 10000 );
    };

    process.on('unhandledRejection', ( error, promise ) => {
        log.error( 'Unhandled Promise rejection detected.' );
        log.error( error );
        log.error( promise );
        log.info( 'Will dump core and exit.' );
        die();
    } );

    process.on('uncaughtException', ( error ) => {
        log.error( 'Unhandled exception detected.' );
        log.error( error );
        log.info( 'Will dump core and exit.' );
        die();
    } );
}

{
    let usages = [];

    profiler.on( 'gc', ( info ) => {
        if ( info.type !== 'MarkSweepCompact' ) { return; }

        usages.push( process.memoryUsage().heapUsed );
        if ( usages.length > 5 ) { usages.shift(); }

        let leaking = usages.sort().toString() !== usages.toString();

        if ( leaking ) {
            log.warn( 'The memory appears to be leaking; taking a heap snapshot.' );
            dumpHeap( () => {}, 'memoryLeak' );
        }
    } );
}

listen();
app.listen( PORT );

log.info( `[fluent:app] App is ready at port '${PORT}'.` );
console.log( `[fluent:app] App is ready at port '${PORT}'.` );
