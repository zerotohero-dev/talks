'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import log from 'local-fluent-logger';
import { init as initCompute } from 'local-fluent-compute';
import { init as initLeakDetector } from 'local-fluent-leak-detector';
import { init as initPostMortem } from 'local-fluent-postmortem';

initCompute();
initPostMortem();
initLeakDetector();

log.info( '[fluent:compute] Started listening.' );
console.log( '[fluent:compute] Started listening.' );
