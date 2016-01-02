'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import cluster from 'cluster';
import express from 'express';
import log from 'local-fluent-logger';
import { cpus } from 'os';
import { init as initMessageBus } from 'local-fluent-bus';
import { init as initLeakDetector } from 'local-fluent-leakdetector';
import { init as initPostMortem } from 'local-fluent-postmortem';
import { initializeApp, startListening } from './app';

// TOOD: update library to listen at the replport.
import { listen as attachRepl } from 'local-fluent-repl';

import { setup as setupRoutes } from './routes';

// TODO: when you import Vantage, you cannot exit with CTRL+C
// it’s probably a “behavior by design”. — Investigate later.
// import Vantage from 'vantage';

console.log( 'hello server.' );


let replPort = 8040;

let forkWorker = () => {
    let worker = cluster.fork();

    worker.send( {
        action: 'init',

        // TODO: this is not ideal. Keep a mapping of cluster.workers.id::replPort
        // whenever the worker dies, remove the replport from the used ports list etc.
        replPort: replPort++,
        workerId: worker.id
    } );
};


if ( cluster.isMaster ) {
    let numCpus = cpus().length;

    {


        for ( let i = 0; i < numCpus; i++ ) {
            console.log( 'forking' );

            forkWorker();
        }

        // Respawn the workers that die:
        cluster.on('exit', ( worker, code, signal ) => {
            console.log( `Worker "${worker.process.pid}" died (${signal||code}). Restarting…` );
            log.info( `Worker "${worker.process.pid}" died (${signal||code}). Restarting…` );

            forkWorker();
        } );
    }
} else {
    process.on( 'message', ( message ) => {
        console.log( 'message came:' );
        console.log( message );


//        console.log( counter, 'workers' );


         let { action, workerId, replPort } = message;

        switch ( action ) {
        case 'init':
            console.log('init oley!');

            initPostMortem();
            initLeakDetector();
            initMessageBus( workerId );
            attachRepl( replPort );

            console.log('express');
            let app = express();

            initializeApp( app );
            setupRoutes( app );
            startListening( app );

            break;
        default:
            break;
        }
    } );
}



