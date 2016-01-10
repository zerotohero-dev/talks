'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import cluster from 'cluster';
import log from 'local-fluent-logger';
import { cpus } from 'os';
import { init as initLeakDetector } from 'local-fluent-leakdetector';
import { init as initPostMortem } from 'local-fluent-postmortem';
import { listen as attachRepl } from 'local-fluent-repl';

let replPort = 8040;
let forkWorker = () => {
    let worker = cluster.fork();

    worker.send( {
        action: 'init',

        // XXX: this is not ideal.
        // Keep a mapping of cluster.workers.id::replPort
        // whenever the worker dies, remove the repl port
        // the used ports list etc.
        replPort: replPort++,
        workerId: worker.id
    } );

    console.log( `Forked Worker "[${worker.id}](${worker.process.pid})".` );
    log.info( `Forked Worker "[${worker.id}](${worker.process.pid})".` );

    return worker;
};

let init = ( preListen, listen ) => {
    if ( cluster.isMaster ) {
        let cpuCount = parseInt( process.env.CLUSTER_SIZE, 10 ) || cpus().length;

        for ( let i = 0; i < cpuCount; i++ ) {
            forkWorker();
        }

        // Respawn the workers that die:
        cluster.on('exit', ( worker, code, signal ) => {
            console.log( `Worker "${worker.process.pid}" died (${signal||code}). Restarting…` );
            log.info( `Worker "${worker.process.pid}" died (${signal||code}). Restarting…` );

            forkWorker();
        } );
    } else {
        process.on( 'message', ( message ) => {
            let { action, workerId, replPort } = message;

            switch ( action ) {
            case 'init':
                initPostMortem();
                initLeakDetector();
                attachRepl( replPort );
                preListen( workerId );
                listen( workerId );

                break;
            default:
                break;
            }
        } );
    }
};

export { init };
