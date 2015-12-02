'use strict'

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { createServer } from 'net';

const PORT = 8082;

let listening = () => console.log(  `Simple TCP API is ready at port '${PORT}'.` );

let handleError = ( error ) => void error;
let handleEnd = () => {};

let serve = ( socket ) => {
    let handleData = ( data ) => socket.end( 'Hello World!' );

    socket.on( 'data', handleData );
    socket.on( 'error', handleError );
    socket.on( 'end', handleEnd );
};

createServer( serve ).listen( PORT, listening );
