'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from '../logger';
import profiler from 'gc-profiler';
import { createConnection as connect } from 'amqp';
import { dumpHeap, dumpCore } from '../dump';
import { get } from 'request';
import { getTags, getUrls } from '../data';
import { listen as listenVantage } from '../repl';
import { Promise } from 'bluebird';

let circuitOpen = false;

{
    let actions = {};

    actions.getTags = ( url ) => new Promise( ( resolve, reject ) => {
        if ( circuitOpen ) {
            reject( {
                error: true,
                description: 'I cannot handle your request right now because the service is shutting down.'
            } );

            return;
        }

        get( url, ( error, response, body ) => {
            if ( error ) {
                reject( error );

                return;
            }

            resolve( getTags( url, body ) );
        } );
    } );

    actions.getUrls = ( tag ) => {
        if ( circuitOpen ) {
            return Promise.reject( {
                error: true,
                description: 'I cannot handle your request right now because the service is shutting down.'
            } );
        }

        return Promise.resolve( getUrls( tag ) );
    };

    let compute = ( message ) => {
        if ( !message ) { return; }

        let key = message.key;
        let requestId = message.requestId;

        if ( !actions[ key ] ) { return; }

        actions[ key ]( message.param ).then( ( data ) => {
            connection.publish( 'fluent-response-queue', { data, requestId } );
        } ).catch ( ( error ) => {
            log.error( error, 'Error in computing response.' );

            connection.publish( 'fluent-response-queue', { error: true, requestId } );
        } );
    };

    let connection = connect( { host: 'rabbit' } );

    connection.on( 'ready', () => {
        connection.queue( 'fluent-request-queue', ( q ) => {
            q.bind( '#' );
            q.subscribe( compute );
        } );

        log.info( `[fluent:compute] The compute node is ready.` );
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

listenVantage();

log.info( '[fluent:compute] Started listening.' );
console.log( '[fluent:compute] Started listening.' );
