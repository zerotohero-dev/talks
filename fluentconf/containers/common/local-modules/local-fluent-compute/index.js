'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import cluster from 'cluster';
import log from 'local-fluent-logger';
import { all as actions } from './actions';
import { createConnection as connect } from 'amqp';

let compute = ( connection, message ) => {
    if ( !message ) {
        log.warn( 'No message.' );

        return;
    }

    if ( !connection ) {
        log.warn( 'No connection.' );

        return;
    }

    let {
        key, requestId, clusterId
    } = message;

    if ( !actions[ key ] ) {
        log.info( `No action key found for "${key}. Yielding.` );

        return;
    }

    actions[ key ]( message.param ).then( ( data ) => {
        connection.publish( `fluent-response-queue-${clusterId}`, { data, requestId } );
    } ).catch ( ( error ) => {
        log.error( error, 'Error in computing response.' );

        connection.publish( `fluent-response-queue-${clusterId}`, { error: true, requestId } );
    } );
};

let processQueue = ( queue, connection ) => {
    queue.bind( '#' );
    queue.subscribe( ( message ) => compute( connection, message ) );
};

let startListening = ( connection ) => {
    connection.queue(
        'fluent-request-queue',
        ( queue ) => processQueue( queue, connection )
    );

    console.log( `[fluent:compute] The compute node is ready.` );
    log.info( `[fluent:compute] The compute node is ready.` );
};

/**
 *
 */
let init = () => {
    if ( cluster.isMaster ) {
        let numCpus = cpus().length;

        for ( let i = 0; i < numCpus; i++ ) {
            cluster.fork();
        }

        // Respawn the workers that die:
        cluster.on('exit', ( worker, code, signal ) => {
            log.info( `Worker "${worker.process.pid}" died (${signal||code}). Restarting…` );

            cluster.fork();
        } );
    } else {
        let connection = connect( { host: 'rabbit' } );

        connection.on( 'ready', () => startListening( connection ) );
    }
};

export { init };
