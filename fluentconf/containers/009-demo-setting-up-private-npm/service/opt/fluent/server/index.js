'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import express from 'express';
import { init as initPostMortem } from 'local-fluent-postmortem';
import { init as initLeakDetector } from 'local-fluent-leak-detector';
import { listen as attachRepl } from 'local-fluent-repl';
import {
    initializeApp,
    startListening
} from './app';
import {
    setup as setupRoutes
} from './routes';
import { init as initMessageBus } from 'local-fluent-bus';

const VANTAGE_PORT = 8004;
const CLUSTER_ID = 1;

initMessageBus( CLUSTER_ID );
initPostMortem();
initLeakDetector();
attachRepl( VANTAGE_PORT );

let app = express();

initializeApp( app );
setupRoutes( app );
startListening( app );
