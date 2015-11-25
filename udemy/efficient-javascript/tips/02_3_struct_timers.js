/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
window.Caller = {
    callMeMaybe: function () {
        var self = this;

        setTimeout(function () {
            console.log('Hi there!');

            self.callMeMaybe();
        }, 1000);
    }
};

window.Caller.callMeMaybe();

window.Caller = null; // will still leak.
delete window.Caller; // ditto.
