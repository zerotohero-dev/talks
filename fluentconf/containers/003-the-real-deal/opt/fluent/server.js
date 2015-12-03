'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { graphql } from 'graphql';

import express from 'express';
import bodyParser from 'body-parser';

import schema from './schema';

const PORT = 8003;

let app = express();

app.use( bodyParser.text( { type: 'application/graphql' } ) );

app.post( '/api/v1/graph', ( req, res ) => {
    void req;

    graphql( schema, req.body )
        .then( ( result ) => {
            res.end( JSON.stringify( result, null, 2 ) )
        } );
} );

app.listen( PORT );

console.log(  `Demo API is ready at port '${PORT}'.` );
