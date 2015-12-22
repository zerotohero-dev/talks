'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { createLogger } from 'bunyan';

let logger = createLogger( {
    name: 'fluent:service',
    streams: [ { path: '/var/log/fluent/service.log' } ]
} );

export default logger;
