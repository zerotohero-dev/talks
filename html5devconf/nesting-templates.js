/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

function ListView() {
    this.childViews = [];
}
function template(){}

ListView.prototype.render = function() {
    var frag = document.createDocumentFragment(),
        views = this.childViews;

    views.forEach(function(view) {

       // DO NOT nest views!
       frag.appendChild(view.render());
    });

    // Resetting the entire container "might" be expensive.
    // Always aim to induce minimum damage to the DOM.
    this.$el.replace(frag);
};

ListView.prototype.getStaleChanges = function() {};
ListView.prototype.resetStaleChanges = function() {};


// Better:

ListView.prototype.render = function() {
    var frag = document.createDocumentFragment(),
        views = this.childViews,
        buffer = [];

    this.data.forEach(function(dataItem) {
        buffer.push('<li>' + template(dataItem) + '</li>' );
    });

    this.$el.replace(frag);
};

// Even Better:

ListView.prototype.render = function() {
    var frag = document.createDocumentFragment(),
        views = this.childViews,

        // returns [{id: id, html: html}]
        delta = this.getStaleChanges();

    delta.forEach(function(item) {
        document.getElementById(
            item.id
        ).innerHTML = item.html;
    });

    this.resetStaleChanges();
};
