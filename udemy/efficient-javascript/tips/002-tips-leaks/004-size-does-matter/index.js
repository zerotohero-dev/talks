/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

function willLeak() {
    var data = 'while(1);throw"";{"list":"le extremely large JSON response"}';

    doStuffWithData(data);

    function Context() {
    }

    return Context;
}
