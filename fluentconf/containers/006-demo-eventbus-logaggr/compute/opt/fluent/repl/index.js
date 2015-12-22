'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import Vantage from 'vantage';

/**
 *
 */
let listen = () => {
    let vantage = new Vantage();

    vantage
        .command( 'ping' )
        .description( 'Checks vantage.' )
        .action( function( args, callback ) {
            this.log( 'pong.' );

            callback();
        } );

    vantage.listen( 8014 );
};

export { listen };
