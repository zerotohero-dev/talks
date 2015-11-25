/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

// ============= "OMG! Where's my Spinner?!" Syndrome ==========================

showLoadingIndicator();
doSomethingExpensive();

// Wrong! Loading incidator will not be visible
// because JavaScript is single-threaded.

// =============================================================================

// Dirty, and at least it works.

function switchViews() {
    setTimeout(function() {
        showLoadingIndicator();
    }, 0);

    setTimeout(function() {
        doSomethingExpensive();
    }, 50); // THIS STINKS!
}

// ====== Welcome to the Race of Timers! =======================================

function iDontWantToLiveOnThisPlanetAnyMore() {
    setTimeout(function() {
        showLoadingIndicator();
    }, 0);

    setTimeout(function() {
        doSomethingExpensive();
    }, 50);

    setTimeout(function() {
        goGrabSomeCoffee();
    }, 100);

    setTimeout(function() {
        makeSureYouWaitEnoughForTheResponse();
    }, 150);
}

// ==== You can sweep things under the rug. ====================================

deferred.when(showLoadingIndicator)
    .then(doSomethingExpensiveIn50Msecs)
    .then(grabSomeCoffeeIn100Msecs)
    .then(whateverIn150MSecs, failDelegate);

// ========== Repaints and Reflows =============================================

for(var i = 0; i < 100; i++) {
    item.innerHTML = 'item' + i;
    list.appendChild(item);// 100 x reflow.
}
