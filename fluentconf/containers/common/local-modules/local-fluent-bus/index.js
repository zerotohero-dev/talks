'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import uuid from 'node-uuid';
import { createConnection as connect } from 'amqp';
import { Promise } from 'bluebird';
import { put as putToRemoteCache, get as getFromRemoteCache } from 'local-fluent-cache';

let connection = null;
let currentClusterId = null;

let resolvers = {};

// Expose state to the REPL.
process.fluent = process.fluent || {};
process.fluent.resolvers = resolvers;

let generateGuid = () => uuid.v4();

/**
 *
 */
let init = ( clusterId ) => {
    currentClusterId = clusterId;

    connection = connect( { host: 'rabbit' } );

    connection.on( 'ready', () => {
        console.log( 'AMQP connection is ready!' );
        log.info( 'AMQP connection is ready!' );

        connection.queue( `fluent-response-queue-${clusterId}`, ( q ) => {
            q.bind( '#' );
            q.subscribe( resolveSubscription );
        } );
    } );
};

let resolveSubscription = ( message ) => {
    if ( !message ) {
        log.warn( 'resolveSubscription: Cannot find message.' );

        return;
    }

    if ( message.error ) {
        log.warn( 'resolveSubscription: Message has error', message.error );

        return;
    }

    let requestId = message.requestId;
    let resolver = resolvers[ requestId ];

    if ( !resolver ) {
        log.info( 'Resolver not found.');

        return;
    }

    let { resolve, param, key } = resolver;

    delete resolvers[ requestId ];

    log.info( 'put to remote cache', `${key}-${param}`, typeof message.data );

    putToRemoteCache( `${key}-${param}`, message.data );

    resolve( message.data );
};

let rejectDeferred = ( requestId, param, action, reject ) =>
    setTimeout( () => {
        delete resolvers[ requestId ];

        reject( {
            error: true,
            message: 'Message bus timed out.',
            param, action
        } );
    }, 5000 );

let doGet = ( key, param ) => getFromRemoteCache( `${key}-${param}` )
    .then( ( cached ) => {
        if ( cached ) { return cached; }

        return new Promise( ( resolve, reject ) => {
            let requestId = generateGuid();

            resolvers[ requestId ] = { resolve, key, param };

            rejectDeferred( requestId, param, key, reject );

            if ( !connection ) {
                reject( {
                    error: true,
                    message: 'Connection is not ready yet.'
                } );

                return;
            }

            console.log('bus:request', param, key );
            connection.publish( 'fluent-request-queue', {
                param,
                key,
                requestId,
                clusterId: currentClusterId
            } );
        } );
    }
);

/**
 *
 */
let getTags = ( url ) => doGet( 'getTags', url );

/**
 *
 */
let getUrls = ( tag ) => doGet( 'getUrls', tag );

export { getTags, getUrls, init };
