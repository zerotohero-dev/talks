'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { Promise } from 'bluebird';
import { isOpen as isCircuitOpen } from 'local-fluent-circuit';
import { get } from 'request';

/**
 *
 */
let getTags = ( url ) => new Promise( ( resolve, reject ) => {
    if ( isCircuitOpen() ) {
        reject( {
            error: true,
            description: 'I cannot handle your request right now because the service is shutting down.'
        } );

        return;
    }

    get( url, ( error, response, body ) => {
        if ( error ) {
            reject( error );

            return;
        }

        resolve( getTags( url, body ) );
    } );
} );

/**
 *
 */
let getUrls = ( tag ) => {
    if ( isCircuitOpen() ) {
        return Promise.reject( {
            error: true,
            description: 'I cannot handle your request right now because the service is shutting down.'
        } );
    }

    return Promise.resolve( getUrls( tag ) );
};

/**
 *
 */
let all = [ getTags, getUrls ];

export { getTags, getUrls, all };
