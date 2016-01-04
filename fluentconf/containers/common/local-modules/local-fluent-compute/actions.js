'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import { get } from 'request';
import {
    getTags as getTagsFromData,
    getUrls as getUrlsFromData
} from 'local-fluent-data';
import { isOpen as isCircuitOpen } from 'local-fluent-circuit';
import { Promise } from 'bluebird';

/**
 *
 */
let getTags = ( url ) => new Promise( ( resolve, reject ) => {
    if ( isCircuitOpen() ) {
        console.log( 'Circuit is open… Exiting.' );
        log.info( 'Circuit is open… Exiting.' );

        reject( {
            error: true,
            description: 'I cannot handle your request right now because the service is shutting down.'
        } );

        return;
    }

    get( url, ( error, response, body ) => {
        if ( error ) {
            log.info( 'error in response' );
            log.info( error );
            if ( error ) {
                log.info( error.stack );
            }

            reject( error );

            return;
        }

        resolve( getTagsFromData( url, body ) );
    } );
} );

/**
 *
 */
let getUrls = ( tag ) => new Promise( ( resolve, reject ) => {
    if ( isCircuitOpen() ) {
        console.log( 'Circuit is open… Exiting.' );
        log.info( 'Circuit is open… Exiting.' );

        reject( {
            error: true,
            description: 'I cannot handle your request right now because the service is shutting down.'
        } );

        return;
    }

    resolve( getUrlsFromData( tag ) );
} );

/**
 *
 */
let all = { getTags, getUrls };

export { getTags, getUrls, all };
