'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { Promise } from 'bluebird';
import { get } from 'request';
import { listen as listenVantage } from '../repl';
import log from '../logger';
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

listenVantage();

log.info( '[fluent:compute] Started listening.' );
console.log( '[fluent:compute] Started listening.' );
