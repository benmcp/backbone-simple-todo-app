/* jshint node: true */
/* global $: true */


var gulp        = require("gulp");
var $           = require("gulp-load-plugins")();
var rimraf      = require("rimraf");
var browserify  = require("browserify");
var vsource     = require("vinyl-source-stream");
var vbuffer     = require("vinyl-buffer");
var runSequence = require("run-sequence");

var envProd     = false;

var dist = "dist/";

/***

	Gulp Functions.

***/

function styles(){
	
	var out = gulp.src('src/style/main.scss')
		.pipe( $.cssGlobbing({
			extensions: ['.css','.scss']
		}))
		.pipe( $.sass({
			style: 'expanded'
		}))
		.on('error', $.sass.logError)
		.on('error', function(e) {
			$.notify().write(e);
		})
		.pipe( $.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		})
	);

	if(!envProd) {
		out.pipe( $.sourcemaps.write() );
	} else {
		out.pipe( $.csso() );
	}

	return out.pipe( gulp.dest(dist + 'css') );
};

function jshint(){
	return gulp.src("src/js/*.js")
		.pipe( $.jshint() )
		.pipe( $.jshint.reporter( "jshint-stylish" ) )
		.pipe( $.jshint.reporter('fail') )
		.on('error', function(e) {
			$.notify().write(e);
		});
}

function javascript(){

	var b = browserify({
		entries: "./src/js/main.js",
		debug: true
	});

	var out =  b.bundle()
    	.pipe(vsource("scripts.min.js"))
    	.pipe(vbuffer())
    	.on('error', function(err){
    		console.log(err.message);
    		this.emit('end');
    	})

    if(!envProd) {
    	out.pipe($.sourcemaps.init({loadMaps: true}))
    		.pipe($.sourcemaps.write("./"));
    } else {
    	out.pipe($.uglify());
    }

   	return out.on("error", function(e) {
   		$.notify().write(e);
   	}).pipe(gulp.dest(dist + "js"));
};

function jsconcat(){
	return gulp.src([
			"bower_components/jquery/dist/jquery.min.js",
			"bower_components/underscore/underscore-min.js",
			"bower_components/backbone/backbone-min.js",
			"bower_components/backbone.localStorage/backbone.localStorage-min.js",
			"src/js/vendor/*.js"
		])
		.pipe( $.concat( "vendor.min.js" ) )
		.pipe( gulp.dest( dist + "js" ) );

}

function watch(){
	$.livereload.listen();

	/** Watch for SASS changes */
	gulp.watch("src/style/**/*.scss", ["styles"]);

	/** Watch for JS changes */
	gulp.watch("src/js/*.js", ["javascript"]);
	gulp.watch("src/js/**/*.js", ["javascript"]);


	gulp.watch([
		dist + "**/*.php",
		dist + "/**/*.js",
		dist + "/**/*.css",
		dist + "/**/*.{jpg,png,svg,webp}"
	]).on( "change", function( file ) {
		$.livereload.changed(file.path);
	});
};



/***

	Gulp Tasks

***/


/** Clean */
gulp.task("clean", function() {
	rimraf.sync(".tmp");
	rimraf.sync(dist);
});

/** Clear Cache */
gulp.task("cacheclear", function() {
	$.cache.clearAll();
});

/** Stylesheets */
gulp.task( "styles", function() {
	return styles();
});

/** JSHint */
gulp.task( "jshint", function () {
	return jshint();
});

/** Compile Javascript */
gulp.task( "javascript", ["jshint"], function() {
	return javascript();
});

/** Concatenate JS*/
gulp.task( "jsconcat", function() {
	return jsconcat();
});

/** Livereload */
gulp.task( "watch", [ "styles", "javascript", "jsconcat"], function() {
	return watch();
});

/** Build */
gulp.task( "build", ["clean","styles","javascript","jsconcat"], function() {} );