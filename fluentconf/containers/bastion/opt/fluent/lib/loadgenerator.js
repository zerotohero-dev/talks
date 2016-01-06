'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { get } from 'request';

let getUrl = function( url ) {
    setTimeout( () => {
        get( url, ( err, response, body ) => {
            console.log( body );

            getUrl( url );
        } );
    }, 2000 );
};

// KLUDGE: probably a transipler bug.
// if not defined, getUrl becomes undefined in closure.
let getUrl2 = ( url ) => getUrl( url );

// TODO: make this configurable from environment
// TODO: pass env variables from startup script using the -e flag
//const TAGS_URL = 'http://app:8005/benchmark/get-tags';

const TAGS_URL = 'http://app:80/benchmark/get-tags';
//const TAGS_URL = 'http://192.168.99.100:8003/benchmark/get-tags';
getUrl( TAGS_URL );

// const URLS_URL = 'http://192.168.99.100:8003/benchmark/get-urls';
// getUrl( URLS_URL );

console.log( 'Started.' );

