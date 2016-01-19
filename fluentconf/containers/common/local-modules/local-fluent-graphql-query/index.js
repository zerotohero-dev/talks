'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import { graphql } from 'graphql';

/**
 *
 */
let query = ( schema, request, response ) => graphql( schema, request.body )
    .then( ( result ) =>
        response.end( JSON.stringify( result, null, 4 ) )
    ).catch( ( error ) => {
        log.error( error, 'Error occurred while executing graphql query.' );

        response.end( 'error' );
    } );

export default query;
