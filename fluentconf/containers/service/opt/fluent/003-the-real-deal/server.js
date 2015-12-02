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

const PORT = 8080;

let app = express();

app.use( bodyParser.text( { type: 'application/graphql' } ) );

app.post( '/api/v1', ( req, res ) => {
    void req;

    graphql( schema, req.body )
        .then( ( result ) => {
            console.log( 'result', result );
            res.end( JSON.stringify( result, null, 2 ) )
        } );
} );

let server = app.listen( PORT, () => {
    const HOST = server.address().address;
    const PORT = server.address().port;

    console.log( `GraphQL listening at 'http://${HOST}:${PORT}'.'` );
} );

/*

endpoint 1:
    * Get a URL
    * extract meaningful text-only content
    * create a set of tags out of that text content
    * store the url/tag mapping in the memory.
    * (the results will be computed every time, and will **not** be
    cached for the sake of the demo.)

endpoint 2:
    * Given a URL
    * Query the memory
    * Get computed tags associated to the url.
*/
