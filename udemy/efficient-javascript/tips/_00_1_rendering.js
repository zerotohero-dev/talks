/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

/********************************************/

showLoadingIndicator();
doSomethingExpensive();

/********************************************/

function switchViews() {
    setTimeout(function() {
        showLoadingIndicator();
    }, 0);

    setTimeout(function() {
        doSomethingExpensive();
    }, 50);
}

/********************************************/

function(1 to 100 ) {
    item.innerHTML = 'item + i; // 100 x reflow.
    list.appendChild(item)
}
