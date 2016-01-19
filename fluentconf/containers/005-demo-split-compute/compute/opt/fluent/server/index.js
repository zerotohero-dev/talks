'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { Promise } from 'bluebird';
import { get } from 'request';
import { createConnection as connect } from 'amqp';
import { getTags, getUrls } from '../data';

let actions = {};

actions.getTags = ( url ) => new Promise( ( resolve, reject ) => {
    get( url, ( error, response, body ) => {
        if ( error ) {
            reject( error );

            return;
        }

        resolve( getTags( url, body ) );
    } );
} );

actions.getUrls = ( tag ) => Promise.resolve( getUrls( tag ) );

let compute = ( message ) => {
    if ( !message ) { return; }

    let key = message.key;
    let requestId = message.requestId;

    if ( !actions[ key ] ) { return; }

    actions[ key ]( message.param ).then( ( data ) => {
        console.log( '[fluent:compute] Publishing to request queue: ', requestId );
        connection.publish( 'fluent-response-queue', { data, requestId } );
        console.log( '[fluent:compute] Published to request queue: ', requestId );
    } ).catch ( ( error ) => {
        void error;

        console.log( '[fluent:compute] Publishing to request queue: ', requestId );
        connection.publish( 'fluent-response-queue', { error: true, requestId } );
        console.log( '[fluent:compute] Published to request queue: ', requestId );
    } );
};

// process.env.RABBIT_PORT_5671_TCP_ADDR
let connection = connect( { host: 'rabbit' } );

connection.on( 'ready', () => {
    connection.queue( 'fluent-request-queue', ( q ) => {
        q.bind( '#' );
        q.subscribe( compute );
    } );

    console.log( `[fluent:compute] The compute node is ready.` );
} );

console.log( '[fluent:compute]: Preparing…' );
