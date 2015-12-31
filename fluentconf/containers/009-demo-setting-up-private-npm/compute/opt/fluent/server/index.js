'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import { init as initCompute } from './compute';
import { init as initLeakDetector } from 'local-fluent-leakdetector';
import { init as initPostMortem } from 'local-fluent-postmortem';
import { listen as startRepl } from 'local-fluent-repl';

initCompute();
initPostMortem();
initLeakDetector();
startRepl();

log.info( '[fluent:compute] Started listening.' );
console.log( '[fluent:compute] Started listening.' );
