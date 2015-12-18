
import { Promise } from 'bluebird';
import { createConnection as connect } from 'amqp';
import { put, get } from 'memory-cache';

let connection = connect( { host: '192.168.99.100' } );
let resolvers = {};
let sequenceId = 0;

const HOURS = 1000 * 60 * 60;

let resolveSubscription = ( message ) => {
    let data = JSON.parse( message.data.toString() );
    let response = data.response;
    let sequenceId = data.sequenceId;
    let resolve = resolvers[ `r${sequenceId}` ];

    if ( !resolve ) { return; }

    delete resolvers[ `r${sequenceId}` ];
    resolve( response );
};

let rejectDeferred = (sequenceId, param, action, reject ) =>
    setTimeout( () => {
        delete resolvers[ `r${sequenceId}` ];

        reject( {
            error: true,
            message: 'Message bus timed out.',
            param, action
        } );
    }, 5000 );

connection.on( 'ready', () => {
    connection.queue( 'fluent-queue', ( q ) => {
        q.bind( '#' );
        q.subscribe( 'getTags-response', resolveSubscription );
        q.subscribe( 'getUrls-response', resolveSubscription );
    } );
} );

let doGet = ( param, key ) =>
    get( `${key}-${param}` ) ||
    new Promise( ( resolve, reject ) => {
        console.log( 'inside promise body' );
        sequenceId++;

        resolvers[ `r${sequenceId}` ] = resolve;

        rejectDeferred( sequenceId, param, key, reject );

        //console.log( 'publishing…')
        connection.publish( `${key}-request`, { param, sequenceId } );
    } ).then(
        ( data ) => put( `${key}-${url}`, data, 3 * HOURS )
    );

/**
 *
 */
let getTags = ( url ) => doGet( url, 'getTags' );

/**
 *
 */
let getUrls = ( tag ) => doGet( tag, 'getUrls' );

export { getTags, getUrls };
