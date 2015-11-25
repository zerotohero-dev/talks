/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
(function() {
    window.addEventListener('load', function() {
        setTimeout(function(){
            console.log(
                    performance.timing.loadEventEnd -
                    performance.timing.responseEnd
            );
        }, 0);
    });
}());
