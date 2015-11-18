'use strict';

import { createServer } from 'http';

const PORT = 8081;

let respond = ( req, res ) => {
    res.writeHead( 200, {'Content-Type': 'application/json'} );
    res.end( 'Hello World!' );
};

let server = createServer( respond ).listen( PORT );

console.log( `Listening to 'localhost' at '${PORT}'.` );
