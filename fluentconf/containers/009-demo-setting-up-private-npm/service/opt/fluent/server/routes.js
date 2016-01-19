'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { isOpen as isShuttingDown } from 'local-fluent-circuit';
import query from 'local-fluent-graphql-query';
import schema from 'local-fluent-schema';
import log from 'local-fluent-logger';

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

const HTTP_INTERNAL_SERVER_ERROR = 500;

let endResponse = ( res ) => {
    console.log( 'Ending response: Most probably the circuit is open.' );
    log.info( 'Ending response: Most probably the circuit is open.' );

    res
        .status( HTTP_INTERNAL_SERVER_ERROR )
        .send(
            JSON.stringify( {
                error: true,
                description: 'I cannot handle your request right now because the service is shutting down. Please try again in a few minutes.'
            } )
        );
};

let setup = ( app ) => {
    app.post( '/api/v1/graph', ( req, res ) => {
        if ( isShuttingDown() ) {
            endResponse( res );

            return;
        }

        if ( checkLoad( res ) ) { return; }

        query( schema, req, res );
    } );

    app.get( '/benchmark/get-tags', ( req, res ) => {
        if ( isShuttingDown() ) {
            endResponse( res );

            return;
        }

        void req;

        let request = {
            body: `{ tags(
                url: "http://web:8080/` +
            `10-tricks-to-appear-smart-during-meetings-27b489a39d1a.html"
            ) }`
        };

        query( schema, request, res );
    } );

    app.get( '/benchmark/get-urls', ( req, res ) => {
        if ( isShuttingDown() ) {
            endResponse( res );

            return;
        }

        void req;

        let request = {
            body: `{
                urls(tag: "tech")
            }`
        };

        query( schema, request, res );
    } );
};

export { setup };
