
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


