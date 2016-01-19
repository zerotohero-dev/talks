'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import compute from './compute';

let processQueue = ( queue, connection ) => {
    queue.bind( '#' );
    queue.subscribe( ( message ) => compute( connection, message ) );
};

let startListening = ( connection ) => {
    connection.queue(
        'fluent-request-queue',
        ( queue ) => processQueue( queue, connection )
    );

    console.log( `[fluent:compute:${process.pid}] The compute node is ready.` );
    log.info( `[fluent:compute:${process.pid}] The compute node is ready.` );
};

export { processQueue, startListening };
