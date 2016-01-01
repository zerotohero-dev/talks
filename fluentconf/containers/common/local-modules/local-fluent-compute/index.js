'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

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

    let key = message.key;
    let requestId = message.requestId;

    if ( !actions[ key ] ) {
        log.info( `No action key found for "${key}. Yielding.` );

        return;
    }

    actions[ key ]( message.param ).then( ( data ) => {
        connection.publish( 'fluent-response-queue', { data, requestId } );
    } ).catch ( ( error ) => {
        log.error( error, 'Error in computing response.' );

        connection.publish( 'fluent-response-queue', { error: true, requestId } );
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
    let connection = connect( { host: 'rabbit' } );

    connection.on( 'ready', () => startListening( connection ) );
};

export { init };
