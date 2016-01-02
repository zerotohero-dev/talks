'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import bodyParser from 'body-parser';

// TODO: when using this, the process does not die on CRL+C
// TODO: open an issue for this against `kiraz` library.
//
// I’m disabling it, since tracker middleware is not vital for the upcoming
// parts of the demo; I’ll fix it when I have time.
//import createTracker from 'local-fluent-tracker-middleware';

import log from 'local-fluent-logger';

const MONITOR_ENDPOINT = '192.168.99.100';
const MONITOR_PORT = 4322;
const PORT = 8005;

/**
 *
 */
let initializeApp = ( app ) => {
    //app.use ( createTracker ( {host: MONITOR_ENDPOINT, port: MONITOR_PORT} ) );
    app.use ( bodyParser.text ( {type: 'application/graphql'} ) );
};

/**
 *
 */
let startListening = ( app ) => {
    app.listen( PORT );

    log.info( `[fluent:app] App is ready at port '${PORT}'.` );
    console.log( `[fluent:app] App is ready at port '${PORT}'.` );
};

export { initializeApp, startListening };
