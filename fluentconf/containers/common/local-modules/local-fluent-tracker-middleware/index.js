'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { inform } from 'local-fluent-repl';
import { trace, start } from 'kiraz';

let tracker = ( req, res, next ) => {
    inform( `[${req.METHOD}] ${req.url}` );

    trace( 'request:start', req.url );

    res.on( 'end', () => {
        trace( 'request:end', req.url );
    } );

    next();
};

let starteds = {};

/**
 *
 */
let create = ( options ) => {
    let key = `${options.host||''}:${options.port||''}`;

    if ( !starteds[ key ] ) {
        starteds[ key  ] = true;

        start( options );
    }

    return tracker;
};

export default create;
