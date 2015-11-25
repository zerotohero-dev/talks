/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
define([
    'core/Config',
    'utils/Debug',
    'backbone'
], function(
    Config,
    Debug,
    Backbone
) {
    'use strict';

    var trace = Debug.trace;

    /**
     *
     */
    return Backbone.Model.extend({
        url : Config.url.LIST_TASKS,

        /**
         *
         */
        initialize : function() {
            trace('>>>ToDoModel.initialize');

            return Backbone.Model.prototype.initialize.apply(this, arguments);
        }
    });
});
