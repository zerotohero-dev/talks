/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var cache;

var Leaker = function(){};

Leaker.prototype = {
    init : function() {
        if (cache) {return;}

        console.log("object: %o", this);
    }
};

function setupLeak() {
    cache = new Leaker();
    cache.init();
}

function destroyLeak() {
    cache = null;// uh, uh?

    //console.clear();
}
