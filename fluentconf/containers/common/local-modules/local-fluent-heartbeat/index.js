'use strict';

import { get } from 'http';
import { log } from 'local-fluent-logger';

const MAX_WAIT_TIMEOUT = 10000;
const HEARTBEAT_INTERVAL = 15000;

let notifyOrchestrator = () => {

    // Send a message to the orchestration system
    // to reboot the app service, create a ticket,
    // page the “on call” ops team etc.

};

let beat = ( heartBeatUrl ) => {
    setInterval( () => {
        let request = get( heartBeatUrl, ( res ) => {
            request.setTimeout( 0 );

            if ( [ 200, 302 ].indexOf( res.statusCode ) === -1 ) {
                let message = `[heartbeat]: Fail with code "${res.statusCode}".`;

                log.error( message );

                notifyOrchestrator( {status: res.statusCode, message} );

                return;
            }

            log.info( `[heartbeat]: OK "${res.statusCode}".` );
        } );

        request.on( 'error', ( err ) => {
            let message = `[heartbeat]: Fail with error "${err}".`;

            log.error( message );

            notifyOrchestrator( { status: -1, message } );
        } );

        request.setTimeout( () => {
            let message = `[heartbeat]: Failed with timeout.`;

            log.error( message );

            notifyOrchestrator( { status: -2, message } );
        }, MAX_WAIT_TIMEOUT );
    }, HEARTBEAT_INTERVAL );
};

export { beat };
