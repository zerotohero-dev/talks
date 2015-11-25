/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

$("#list .countries").on("click", function() {
    $(".box").value = this.innerHTML;
});

//
$("#list").on("click", function() {
    if(!$(this).hasClass("countries")) {return;}

    $(".box").value = this.innerHTML;
});
