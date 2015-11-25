/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

var Leaker = function(){};
Leaker.prototype = {
    init:function(){}
};

var cache = null;

function setupLeak() {
    if (cache) {return;}

    cache = new Leaker();
}

function destroyLeak() {
    cache = null;
}

//TODO: make this a folder

// pubsub leaks.

var Hub = {
    privates : {
        observers: {}
    },

    bind: function(observer, subject, message, delegate) {
        var id = subject.id;

        if (!this.privates.observers[id]) {
            this.privates.observers[id] = {};
        }

        if (!this.privates.observers[id][message]) {
            this.privates.observers[id][message] = [];
        }

        this.privates.observers[id][message].push({
            observer : observer,
            delegate : delegate
        });
    },

    trigger: function(subject, message) {
        var id        = subject.id,
            observers = this.privates.observers[id][message],
            observer,
            i,
            len;

        for (i=0, len = observers.length; i<len; i++) {
            mixed = observers[i];
            mixed.delegate.call(null, subject, {});
        }
    }
};

var counter = 0;
function View(id) {this.id = 'view'+(counter++);}
function Model()  {}

var observers = {};
obsevers.mainView = new View();

var subjects = {};
subjects.mainModel = new Model();

function bind() {
    Hub.bind(
        observers.mainView, subjects.mainModel, "data:changed",
        function(sender, args) {
            console.log("Hello");
        }
    );
}

function trigger() {
    Hub.trigger(subjects.mainModel, "data:changed");
}

function unbind() {
    delete observers.mainView;
    delete subjects.mainModel;
}

bind();
trigger();
unbind();


// what allocates memory:


// event binding does not magically happens.
// the framework has to do the bookkeeping of objects.
