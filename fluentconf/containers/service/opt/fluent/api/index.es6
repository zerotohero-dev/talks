'use strict';

import { createServer } from 'restify';

const PORT = 8080;

let respond = ( req, res, next ) => {
    // check what content type this is sending to curl.
    res.send( 'Hello World!' );

    next();
};

let listening = () => console.log( `Listening to '${server.name}' at '${server.url}'.` );

let server = createServer();

server.get( '/hello', respond );
server.head( '/hello', respond );

server.listen( PORT, listening );
