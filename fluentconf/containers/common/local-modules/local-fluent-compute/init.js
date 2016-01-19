'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { init as initCluster } from 'local-fluent-cluster';
import { createConnection as connect } from 'amqp';

let connection = null;
const GRACE_PERIOD = 30000;

/**
 *
 */
let init = () => {
    initCluster(
        () => {},
        () => {
            connection = connect( { host: 'rabbit' } );

            connection.on( 'ready', () => startListening( connection ) );
        },
        () => {
            {
                // Die gracefully.

                if ( !connection ) { return; }

                // Do not accept any further connections.
                connection.disconnect();

                connection.socket.on( 'close', () => {
                    process.exit( 0 );
                } );
            }

            {
                // Die forcefully.

                ( setTimeout( () => {
                    process.exit( 0 );
                }, GRACE_PERIOD ) ).unref();
            }
        }
    );
};

export default init;
