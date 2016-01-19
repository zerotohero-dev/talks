'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import { createClient } from 'redis';
import { put as mput, get as mget } from 'memory-cache';

const THREE_HOURS = 3 * 1000 * 60 * 60;
const THREE_HOURS_IN_SECS = 3 * 60 * 60;

let cache = {};

if ( process.env.REDIS_PORT ) {
    console.log( 'cache: found redis; will use redis.' );
    log.info( 'cache: found redis; will use redis.' );

    let client = createClient( { host: 'redis', port: 6379 } );

    cache.put = ( key, value, persist ) => {
        console.log( 'setex', key, value );

        if ( persist ) {
            client.set(
                key,
                typeof value === 'object' ? JSON.stringify( value ) : value
            );

            return;
        }

        client.setex(
            key,
            THREE_HOURS_IN_SECS,
            typeof value === 'object' ? JSON.stringify( value ) : value
        );
    };

    cache.get = ( key ) => new Promise( ( resolve, reject ) => {
        void reject;

        client.get( key, ( err, reply ) => {
            resolve( JSON.parse( reply ) );
        } );
    } );
} else {
    console.log( 'Cache: no redis found; falling back to in-memory cache.' );
    log.info( 'Cache: no redis found; falling back to in-memory cache.' );

    cache.put = ( key, value, persist ) => mput( key, value, persist ? Number.POSITIVE_INFINITY : THREE_HOURS );
    cache.get = ( key ) => Promise.resolve( mget( key ) );
}

export default {
    put: cache.put,
    get: cache.get
};
