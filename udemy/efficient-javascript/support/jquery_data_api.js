/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

function testProperties() {
    $(document.body).data('property', 'value');

    console.log($(document.body).data('property'));
}
