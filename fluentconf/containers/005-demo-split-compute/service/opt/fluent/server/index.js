'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { listen, inform } from '../repl';
import { graphql } from 'graphql';
import { trace, start } from 'kiraz';
import bodyParser from 'body-parser';
import express from 'express';
import schema from '../schema';

const MONITOR_EDPOINT = '192.168.99.100';
const MONITOR_PORT = 4322;
const PORT = 8003;

start( {
    host: MONITOR_EDPOINT,
    port: MONITOR_PORT
} );

let tracker = ( req, res, next ) => {
    inform( `[${req.METHOD}] ${req.url}` );

    trace( 'request:start', req.url );

    res.on( 'end', () => {
        trace( 'request:end', req.url );
    } );

    next();
};

let query = ( schema, request, response ) => graphql( schema, request.body )
    .then( ( result ) =>
        response.end( JSON.stringify( result, null, 4 ) )
    ).catch( ( error ) => {

        // TODO: properly log this error.
        // TODO: Use a central logger that pushes all the logs to a log aggregator.
        // TODO: set up log rotation.
        console.log( 'error', error );

        response.end( 'error' );
    } );

let app = express();

app.use( tracker );
app.use( bodyParser.text( { type: 'application/graphql' } ) );

app.post( '/api/v1/graph', ( req, res ) => query( schema, req, res ) );

app.get( '/benchmark/get-tags', ( req, res ) => {
    void req;

    let request = {
        body: `{ tags(
            url: "http://192.168.99.100:8080/` +
            `10-tricks-to-appear-smart-during-meetings-27b489a39d1a.html"
        ) }`
    };

    return query( schema, request, res );
} );

app.get( '/benchmark/get-urls', ( req, res ) => {
    void req;

    let request = {
        body: `{
            urls(tag: "tech")
        }`
    };

    return query( schema, request, res );
} );

listen( app, PORT );

console.log( `[fluent:app] is ready at port '${PORT}'.` );
