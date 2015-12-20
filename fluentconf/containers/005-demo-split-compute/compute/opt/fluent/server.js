'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { createConnection as connect } from 'amqp';

let compute = () => {
    console.log( 'compute…' );
};

let connection = connect( { host: '192.168.99.100' } );

connection.on( 'ready', () => {
    connection.queue( 'fluent-request-queue', ( q ) => {
        q.bind( '#' );
        q.subscribe( compute );
    } );
} );
