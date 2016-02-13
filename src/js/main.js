/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

AppView = require('./views/app-view.js');

 var Backbone = require('backbone');
 Backbone.$ = $;


$(document).ready(function() {
	require('./module/init.js');
	require('./module/base.js');
	require("./models/todo.js");
	require("./collections/todo.js");
	require("./views/todo-view.js");
	require("./views/app-view.js");

	new AppView();
	require("./routers/router.js");

});

