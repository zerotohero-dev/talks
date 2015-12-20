'use strict';

import { createConnection as connect } from 'amqp';

let connection = connect( { host: '192.168.99.100' } );

// Consumer Code Below:

// VM 001:
connection.on( 'ready', () => {
    connection.queue( 'fluent-request-queue', ( q ) => {
        q.bind( '#' );

        q.subscribe( () => {
            console.log( 'VM001: Got request.' );
            connection.publish( 'fluent-response-queue', { message: 'Hello World' } );
        } );
    } );
} );

// VM 002:
connection.on( 'ready', () => {
    connection.queue( 'fluent-request-queue', ( q ) => {
        q.bind( '#' );

        q.subscribe( () => {
            console.log( 'VM002: Got request.' );
            connection.publish( 'fluent-response-queue', { message: 'Hello World' } );
        } );
    } );
} );

// Publisher Code Below:

// VM 003:
connection.on( 'ready', () => {
    connection.queue( 'fluent-response-queue', ( q ) => {
        q.bind( '#' );

        q.subscribe( () => {
            console.log( 'VM003: Got response.' );
        } );
    } );
} );

// VM 004:
connection.on( 'ready', () => {
    connection.queue( 'fluent-response-queue', ( q ) => {
        q.bind( '#' );

        q.subscribe( () => {
            console.log( 'VM004: Got response.' );
        } );
    } );
} );

setInterval( () => {
    connection.publish( 'fluent-request-queue', { message: 'Hello World' } );
}, 1000 );
