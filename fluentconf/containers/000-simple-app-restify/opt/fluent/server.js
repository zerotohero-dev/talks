'use strict';

import { createServer } from 'restify';

const PORT = 8000;

let listening = () => console.log( `Simple restify API is ready at port '${PORT}'.` );

let respond = ( req, res, next ) => {
    res.send( 'Hello World!' );

    next();
};

let server = createServer({});

server.get( '/hello', respond );

server.listen( PORT, listening );
