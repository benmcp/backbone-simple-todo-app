 'use strict';

 var $ = require('jquery');
 var Backbone = require('backbone');
 var TodoView = require('../views/app-view.js');
 Backbone.$ = $;


// ----------
var TodoRouter = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function (param) {
		// Set the current filter to be used
		module.exports.TodoFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Todo view items
		TodoView.prototype.trigger('filter');
	}
});

module.exports.TodoRouter = new TodoRouter();
Backbone.history.start();
