 'use strict';

 var $ = require('jquery');
 var Backbone = require('backbone');
 var TodoView = require('../views/app-view.js');
 var Todos = require('../collections/todo.js');
 Backbone.$ = $;


// ----------
module.exports = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function (param) {
		// Set the current filter to be used
		Todos.TodoFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Todo view items
		Todos.trigger('filter');
	}
});

Backbone.history.start();
