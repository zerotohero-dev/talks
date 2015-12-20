'use strict';

import { createServer } from 'http';

const PORT = 8001;

let respond = ( req, res ) => {
    res.writeHead( 200, { 'Content-Type': 'application/json' } );
    res.end( 'Hello World!' );
};

createServer( respond ).listen( PORT );

console.log(  `Simple HTTP API is ready at port '${PORT}'.` );
