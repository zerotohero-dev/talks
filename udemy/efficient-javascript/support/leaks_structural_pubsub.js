/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
var Hub = {
    privates : {
        observers: {}
    },

    bind: function(observer, subject, message, delegate) {

        // Use id of the subject as key, not the subject itself.
        var id = subject.id;

        this.privates.observers[id]          = this.privates.observers[id] || {};
        this.privates.observers[id][message] = this.privates.observers[id][message] || [];

        this.privates.observers[id][message].push({

            // a ref to the observer.
            observer : observer,
            delegate : delegate
        });
    },

    trigger: function(subject, message) {
        var id        = subject.id,
            observers = this.privates.observers[id][message],
            observer, i, len;

        for (i=0, len = observers.length; i<len; i++) {
            mixed = observers[i];
            mixed.delegate.call(null, subject, {});
        }
    }
};

// =============================================================================

var counter = 0;

function View(id) {this.id = 'view'+(counter++);}
function Model()  {}

// =============================================================================

var observers = {};
obsevers.mainView = new View();

var subjects = {};
subjects.mainModel = new Model();

// =============================================================================

function bind() {
    Hub.bind(
        observers.mainView, subjects.mainModel, "data:changed",
        // normally, this is a method on the observer:
        function(sender, args) {
            console.log("Hello");
        }
    );
}

function trigger() {
    Hub.trigger(subjects.mainModel, "data:changed");
}

function cleanup() {
    delete observers.mainView; // mainView will still leak!
    delete subjects.mainModel;

    // Hub.unbind(null, null, "data:changed")
}

bind();
trigger();
cleanup();
