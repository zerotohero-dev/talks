/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
function handleAjaxResponse(res) {

    // If the user is "interactive", then
    // wait for her gesture to finish.
    if (isUiInMotion) {
        delay(function() {
            handleAjaxResponse(res);
        }, 400);

        return;
    }

    doUiManipulationMagic();
}
