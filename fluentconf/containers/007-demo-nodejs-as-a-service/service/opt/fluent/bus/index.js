
import { Promise } from 'bluebird';
import { createConnection as connect } from 'amqp';
import { put, get } from 'memory-cache';
import uuid from 'node-uuid';

const HOURS = 1000 * 60 * 60;

let connection = connect( { host: 'rabbit' } );

let resolvers = {};

// Expose state to the REPL.
process.fluent = process.fluent || {};
process.fluent.resolvers = resolvers;

let generateGuid = () => uuid.v4();

let resolveSubscription = ( message ) => {
    if ( !message ) {return;}
    if ( message.error ) {return;}

    let requestId = message.requestId;
    let resolver = resolvers[ requestId ];

    if ( !resolver ) {return;}

    let resolve = resolvers[ requestId ];

    delete resolvers[ requestId ];

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

connection.on( 'ready', () => {
    connection.queue( 'fluent-response-queue', ( q ) => {
        q.bind( '#' );
        q.subscribe( resolveSubscription );
    } );
} );

let doGet = ( key, param ) => {
    let cached = get( `${key}-${param}` );

    if ( cached ) {
        return cached;
    }

    return new Promise( ( resolve, reject ) => {
        let requestId = generateGuid();

        resolvers[ requestId ] = resolve;

        rejectDeferred( requestId, param, key, reject );

        connection.publish(
            'fluent-request-queue',
            { param, key, requestId }
        );
    } ).then(
        ( data ) => put ( `${key}-${param}`, data, 3 * HOURS )
    );
};

/**
 *
 */
let getTags = ( url ) => doGet( 'getTags', url );

/**
 *
 */
let getUrls = ( tag ) => doGet( 'getUrls', tag );

export { getTags, getUrls };
