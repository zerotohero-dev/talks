'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';

let circuitOpen = false;
let alreadyScheduledTimer = false;
let serverBusy = false;

/**
 *
 */
let isOpen = () => circuitOpen;

/**
 *
 */
let isClosed = () => !circuitOpen;

/**
 *
 */
let close = () => circuitOpen = false;

/**
 *
 */
let open = () => circuitOpen = true;

/**
 *
 */
let isServerBusy = () => serverBusy;

/**
 *
 */
let unsetBusy = () => serverBusy = false;

/**
 *
 */
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

export { open, close, isOpen, isClosed, checkLoad };
