'use strict';

import log from 'local-fluent-logger';
import { all as actions } from './actions';
import { createConnection as connect } from 'amqp';

let compute = ( connection, message ) => {
    if ( !message ) { return; }
    if ( !connection ) { return; }

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

let processQueue = ( queue, connection ) => {
    queue.bind( '#' );
    queue.subscribe( ( message ) => compute( connection, message ) );
};

let startListening = ( connection ) => {
    connection.queue(
        'fluent-request-queue',
        ( queue ) => processQueue( queue, connection )
    );

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
