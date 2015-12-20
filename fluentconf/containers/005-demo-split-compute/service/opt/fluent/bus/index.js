
import { Promise } from 'bluebird';
import { createConnection as connect } from 'amqp';
import { put, get } from 'memory-cache';
import uuid from 'node-uuid';

const HOURS = 1000 * 60 * 60;

let connection = connect( { host: '192.168.99.100' } );
let resolvers = {};

let generateGuid = () => uuid.v4();

let resolveSubscription = ( message ) => {
    console.log( 'Will resolve subscription' );

    void message;

    throw 'Not Implemented Yet!';

    //let data = JSON.parse( message.data.toString() );
    //let response = data.response;
    //let sequenceId = data.sequenceId;
    //let resolve = resolvers[ `r${sequenceId}` ];
    //
    //if ( !resolve ) { return; }
    //
    //delete resolvers[ `r${sequenceId}` ];
    //resolve( response );
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

let doGet = ( key, param ) =>
    get( `${key}-${param}` ) ||
    new Promise( ( resolve, reject ) => {
        let requestId = generateGuid();

        resolvers[ requestId ] = resolve;

        rejectDeferred( requestId, param, key, reject );

        connection.publish(
            'fluent-request-queue',
            { param, key, requestId }
        );
    } ).then(
        ( data ) => put( `${key}-${param}`, data, 3 * HOURS )
    );

/**
 *
 */
let getTags = ( url ) => doGet( 'getTags', url );

/**
 *
 */
let getUrls = ( tag ) => doGet( 'getUrls', tag );

export { getTags, getUrls };
