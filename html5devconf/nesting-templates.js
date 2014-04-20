function ListView() {}

ListView.prototype.render = function() {
    var frag = document.createDocmentFragment(),
        views = this.childViews;


    views.forEach(function(view) {

       // DO NOT nest views!
       frag.appendChild(view.render());
    });

    // Resetting the entire container "might" be expensive.
    // Always aim to induce minimum damage to the DOM.
    this.$el.replace(frag);
};

// Better:

ListView.prototype.render = function() {
    var frag = document.createDocmentFragment(),
        views = this.childViews,
        buffer = [];

    this.data.forEach(function(dataItem) {
        buffer.push('<li>' + template(dataItem) + '</li>' );
    });

    views.forEach(function(view) {

        // DO NOT nest views!
        frag.appendChild(view.render());
    });

    this.$el.replace(frag);
};

// Even Better:

ListView.prototype.render = function() {
    var frag = document.createDocmentFragment(),
        views = this.childViews,

        // returns [{id: id, html: html}]
        delta = this.getStaleChanges();

    delta.forEach(function(item) {
        document.getElementById(
            item.id
        ).innerHTML = item.html;
    })

    this.resetStaleChanges();
};

