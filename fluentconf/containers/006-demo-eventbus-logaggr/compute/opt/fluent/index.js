'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

require( 'babel-register' );
require( './server' );

// TODO:
// 1. run `cluster-run-006... sh`
// 2. make sure that service and vantage ports are properly bound.
// 3. make sure that folders are properly bound.
// 4. run compute and service nodes and make sure that logs are generated properly.
// 5. make sure that vantage works properly and can access the global context in both compute and app instance.
// 6. when all of the above is working, update the readme, commit and merge the branch.
