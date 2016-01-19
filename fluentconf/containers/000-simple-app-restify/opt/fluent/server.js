'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

let listening = () => console.log( `Simple restify API is ready at port '${PORT}'.` );

import { createServer } from 'restify';

const PORT = 8000;

let respond = ( req, res, next ) => {
    res.send( 'Hello World!' );

    next();
};

let server = createServer();

server.get( '/hello', respond );
server.head( '/hello', respond );

server.listen( PORT, listening );
