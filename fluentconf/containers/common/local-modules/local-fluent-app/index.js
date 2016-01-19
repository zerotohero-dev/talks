'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import express from 'express';
import { initializeApp, startListening } from './app';
import { setup as setupRoutes } from './routes';
import { init as initCluster } from 'local-fluent-cluster';
import { init as initMessageBus } from 'local-fluent-bus';

let GRACE_PERIOD = process.env.NODE === 'production' ? 600000 : 30000;

let init = () => {
    let app = null;
    initCluster(
        ( workerId ) => {
            initMessageBus( workerId );
        },
        ( workerId ) => {
            void workerId;
            app = express();
            initializeApp( app );
            setupRoutes( app );
            startListening( app );
        },
        () => {
            if ( !app ) { return; }

            // Do not accept any further connections.
            app.close();

            // Die gracefully.
            ( setTimeout( () => {
                process.exit( 0 );
            }, GRACE_PERIOD ) ).unref();
        }
    );
};

export { init };
