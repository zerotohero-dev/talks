'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import express from 'express';
import bodyParser from 'body-parser';
import { graphql } from 'graphql';
import schema from './schema';

const PORT = 8003;

let app = express();

app.use( bodyParser.text( { type: 'application/graphql' } ) );

app.post( '/api/v1/graph', ( req, res ) => {
    graphql( schema, req.body )
        .then( ( result ) =>
            res.end( JSON.stringify( result, null, 4 ) )
        );
} );

app.get( '/benchmark/get-tags', ( req, res ) => {
    void req;

    let query = `
        {
            tags(url: "http://web:8080/10-tricks-to-appear-smart-during-meetings-27b489a39d1a.html")
        }
    `;

    graphql( schema, query )
        .then( ( result ) =>
            res.end( JSON.stringify( result, null, 4 ) )
        );
} );

app.get( '/benchmark/get-urls', ( req, res ) => {
    void req;

    let query = `
        {
            urls(tag: "tech")
        }
    `;

    graphql( schema, query )
        .then( ( result ) =>
            res.end( JSON.stringify( result, null, 4 ) )
        );
} );

app.listen( PORT );

console.log(  `Demo API is ready at port '${PORT}'.` );
