'use strict'

import { createServer } from 'net';

const PORT = 8082;

let listening = () => console.log( `Listening to '${server.name}' at '${server.url}'.` );

let server = createServer( ( socket ) => {
    let handleData = ( data ) => {
        socket.end( 'Hello World!' );
    };

    let handleError = ( error ) => {
    };

    let handleEnd = () => {
    };

    socket.on( 'data', handleData );
    socket.on( 'error', handleError );
    socket.on( 'end', handleEnd );
} ).listen( PORT, listening );
