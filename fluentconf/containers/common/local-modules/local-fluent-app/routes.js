'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { checkLoad, isOpen as isCircuitOpen } from 'local-fluent-circuit';
import query from 'local-fluent-graphql-query';
import schema from 'local-fluent-schema';
import log from 'local-fluent-logger';

const HTTP_INTERNAL_SERVER_ERROR = 500;

let endResponse = ( res ) => {
    console.log( 'Ending response: Most probably the circuit is open.' );
    log.info( 'Ending response: Most probably the circuit is open.' );

    res
        .status( HTTP_INTERNAL_SERVER_ERROR )
        .send(
            JSON.stringify( {
                error: true,
                description: 'I cannot handle your request right now because the service is shutting down.'
            } )
        );
};

let setup = ( app ) => {
    app.post( '/api/v1/graph', ( req, res ) => {
        if ( isCircuitOpen() ) {
            endResponse( res );

            return;
        }

        if ( checkLoad( res ) ) { return; }

        query( schema, req, res );
    } );

    app.get( '/benchmark/get-tags', ( req, res ) => {
        if ( isCircuitOpen() ) {
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
        if ( isCircuitOpen() ) {
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
