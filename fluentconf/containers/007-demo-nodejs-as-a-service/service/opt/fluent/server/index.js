'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { listen as listenVantage, inform } from '../repl';
import { graphql } from 'graphql';
import { trace, start } from 'kiraz';
import bodyParser from 'body-parser';
import express from 'express';
import schema from '../schema';
import log from '../logger';

const MONITOR_ENDPOINT = '192.168.99.100';
const MONITOR_PORT = 4322;
const PORT = 8003;

let serverBusy = false;
let isServerBusy = () => serverBusy;
let unsetBusy = () => serverBusy = false;

let alreadyScheduledTimer = false;
let checkLoad = ( res ) => {
    if ( !isServerBusy() ) { return false; }

    log.error( 'api/v1/graph', 'The service is overloaded!' );

    res
        .status( 503 )
        .end( 'The server is busy. Try again later.' );

    if ( !alreadyScheduledTimer ) {
        setTimeout( () => {
            unsetBusy();
            alreadyScheduledTimer = false;
        }, 30000 ).unref();
    }
    alreadyScheduledTimer = true;

    return true;
};

start( {
    host: MONITOR_ENDPOINT,
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
        log.error( error, 'Error occurred while executing graphql query.' );

        response.end( 'error' );
    } );

let app = express();

app.use( tracker );
app.use( bodyParser.text( { type: 'application/graphql' } ) );

app.post( '/api/v1/graph', ( req, res ) => {
    if ( checkLoad( res ) ) { return; }

    query( schema, req, res );
} );

app.get( '/benchmark/get-tags', ( req, res ) => {
    void req;

    let request = {
        body: `{ tags(
            url: "http://web:8080/` +
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

listenVantage();
app.listen( PORT );

log.info( `[fluent:app] App is ready at port '${PORT}'.` );
console.log( `[fluent:app] App is ready at port '${PORT}'.` );
