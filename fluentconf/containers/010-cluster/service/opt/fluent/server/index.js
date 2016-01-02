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
import { init as initMessageBus } from 'local-fluent-bus'
import { init as initLeakDetector } from 'local-fluent-leakdetector';
import { init as initPostMortem } from 'local-fluent-postmortem';
import { initializeApp, startListening } from './app';
import { listen as attachRepl } from 'local-fluent-repl';
import { setup as setupRoutes } from './routes';

if ( cluster.isMaster ) {
    let numCpus = cpus().length;

    {
        for ( let i = 0; i < numCpus; i++ ) {
            cluster.fork();
        }

        // Respawn the workers that die:
        cluster.on('exit', ( worker, code, signal ) => {
            log.info( `Worker "${worker.process.pid}" died (${signal||code}). Restarting…` );

            cluster.fork();
        } );
    }

    {
        let replPort = 8040;

        cluster.on( 'listening', ( worker ) => {
            worker.send( {
                action: 'init',
                replPort,
                workerId: worker.id
            } );

            replPort++;

            // XXX: With an assumption that there will be at most `numCpus`
            // workers at any given moment.
            if ( replPort === 8040 + numCpus ) { replPort = 8040; }
        } );
    }
} else {
    {
        process.on( 'message', ( message ) => {
            let {
                action,
                workerId,
                replPort
            } = message;

            switch ( action ) {
                case 'init':
                    initPostMortem();
                    initLeakDetector();
                    initMessageBus( workerId );
                    attachRepl( replPort );

                    break;
                default:
                    break;
            }
        } );
    }

    {
        let app = express();

        initializeApp( app );
        setupRoutes( app );
        startListening( app );
    }
}



