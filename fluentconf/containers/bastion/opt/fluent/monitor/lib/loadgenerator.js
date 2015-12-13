'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { get } from 'request';

const TAGS_URL = 'http://192.168.99.100:8003/benchmark/get-tags';
const URLS_URL = 'http://192.168.99.100:8003/benchmark/get-urls';

let getUrl = ( url ) => {
    get( url, () => {} );
    get( url, () => {} );
    get( url, () => {} );
    get( url, () => {} );
    get( url, () => getUrl( url ) );
};

getUrl( TAGS_URL );

console.log( 'started' );
