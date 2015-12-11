'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { graphql } from 'graphql';
import bodyParser from 'body-parser';
import express from 'express';
import probes from './monitor';
import schema from './schema';
import trace from 'jstrace';

const PORT = 8003;

let app = express();

app.use( bodyParser.text( { type: 'application/graphql' } ) );

app.post( '/api/v1/graph', ( req, res ) => {
    graphql( schema, req.body )
        .then( ( result ) => {
            res.end( JSON.stringify( result, null, 4 ) )
        } );
} );

app.get( '/benchmark/get-tags', ( req, res ) => {
    void req;

    var st = (new Date()).getTime();

    let token = { action: 'get-tags' };

    trace( 'request:start', token );

    let query = `
        {
            tags(url: "http://192.168.99.100:8080/10-tricks-to-appear-smart-during-meetings-27b489a39d1a.html")
        }
    `;

    graphql( schema, query )
        .then( ( result ) => {
            res.end( JSON.stringify( result, null, 4 ) )

            var et = (new Date()).getTime();

            console.log( et - st );

            trace( 'request:end', token )
        } );
} );

app.get( '/benchmark/get-urls', ( req, res ) => {
    void req;

    let token = { action: 'get-urls' };

    let query = `
        {
            urls(tag: "tech")
        }
    `;

    trace( 'request:start', token );

    graphql( schema, query )
        .then( ( result ) => {
            res.end( JSON.stringify( result, null, 4 ) )

            trace( 'request:end', token );
        } );
} );

app.listen( PORT );

console.log(  `Demo API is ready at port '${PORT}'.` );
