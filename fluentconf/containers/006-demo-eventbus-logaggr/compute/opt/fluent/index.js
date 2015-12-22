'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

require( 'babel-register' );
require( './server' );

// TODO: add to worklog:
// using docker --link instead of routing outside and then coming back in
// normally you use something like consul for discovery, however in our case
// docker link is sufficient.
// (discovery section on presentation, this is trying to get out of hands, add
// a discovery service)

// TODO: repl in clustered mode: create one repl for the master and N different
// repls for the children. you can also create a “debug” message queue to
// decrease the load of real-time socket communication,
// connection.publish( 'debug-compute-master', { action: getPid } )
// connection.publish( 'debug-compute-child-001', { action: getOpenHandleCount } )
