'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { get } from 'request';
import { Promise } from 'bluebird';
import { prepare } from './data';

/**
 *
 */
let getTags = ( url ) => new Promise( ( resolve, reject ) =>
    get( url, ( error, response, body ) => {
        if ( error ) {
            reject( error );

            return;
        }

        resolve( prepare( url, body ) );
    } )
);

export { getTags };
