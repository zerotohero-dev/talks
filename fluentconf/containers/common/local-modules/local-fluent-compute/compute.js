'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import { all as actions } from './actions';

let compute = ( connection, message ) => {
    log.info( 'compute', message );

    if ( !message ) {
        log.warn( 'No message.' );

        return;
    }

    if ( !connection ) {
        log.warn( 'No connection.' );

        return;
    }

    let { key, requestId, clusterId } = message;

    if ( !actions[ key ] ) {
        log.info( `No action key found for "${key}. Yielding.` );

        return;
    }

    actions[ key ]( message.param ).then( ( data ) => {
        log.info( 'Publising to the response queue', requestId, typeof data );

        connection.publish( `fluent-response-queue-${clusterId}`, { data, requestId } );
    } ).catch ( ( error ) => {
        log.error( error, 'Error in computing response.' );

        connection.publish( `fluent-response-queue-${clusterId}`, { error: true, requestId } );
    } );
};

export default compute;
