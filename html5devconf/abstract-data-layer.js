// Dummy definitions to make the IDE happy.
function render() {}
function defer() { return {resolve: function() {}, promise: {then: function(){}}};}
var app = {};
app.data = {};
app.rendering = { renderProfilePage: function() {}};
var $ = {get: function(){}};

// instead of this...

$.get('/api/v5/users/42/profile.json', function(res) {render(res);});

// ------------------------------------------------------------------

// Do this:

// Makes a network request, and caches the eventual result for later use.
app.data.getUserProfile = function(userId) {
    if (app.data.getUserProfile.promise) {return app.data.getUserProfile.promise;}

    // Promises FTW: https://promises-aplus.github.io/promises-spec/
    var deferred = defer();

    $.get('/api/v5/users/' + userId  + '/profile.json', function(res) {
        deferred.resolve(res);
    }, function(error) {

        // Naive retry mechanism -- NOT production-ready.
        app.data.getUserProfile.promise = null;
        deferred.resolve(app.data.getUserProfile(userId));
    });

    app.data.getUserProfile.promise = deferred.promise;

    return deferred.promise;
};

// Abstract your data access layer.
app.data.getUserProfile(42).then(function(result) {

    // Abstract your DOM manipulations too.
    app.rendering.renderProfilePage(result);
});




