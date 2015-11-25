/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
function nill() {};

function XHRLeak() { // IE < 9
    var ajax = new XMLHttpRequest();

    ajax.open('GET', '/service/endpoint', true);

    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) {
            doMagic(ajax.responseText);

            // ajax.onreadystatechange = function(){};
            // ajax.onreadystatechange = nill;
            // ajax = null;
        }
    };

    ajax.send('');
}
