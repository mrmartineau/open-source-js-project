'use strict';

// Include Gulp & Tools We'll Use
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var browserify  = require('browserify');
var uglify      = require('gulp-uglify');
var transform   = require('vinyl-transform');


var CONFIG = {
	JS : {
		SRCFILE : 'js/zander.js', // CONFIG.JS.SRCFILE
		DISTDIR : 'js/dist/', // CONFIG.JS.DISTDIR
		DISTFILE : 'zander.js', // CONFIG.JS.DISTFILE
		LIBS : [ // CONFIG.JS.LIBS
			'bower_components/swiftclick/js/libs/swiftclick.js',
			'bower_components/trak/dist/trak.js',
			// 'js/scrollConverter.js',
		],
		FILELIST : [ // CONFIG.JS.FILELIST
			'js/script.js'
		]
	},

	CSS : {
		SRCDIR : 'scss'
	},

	AUTOPREFIXER_BROWSERS : [
		'> 5%',
		'last 2 versions',
		'ie > 8'
	]
};

var jsFiles = CONFIG.JS.LIBS.concat(CONFIG.JS.FILELIST);


// JAVASCRIPT
gulp.task('browserify', function () {
	var browserified = transform(function(filename) {
		var b = browserify(filename);
		return b.bundle();
	});

	return gulp.src(CONFIG.JS.SRCFILE)
		.pipe(browserified)
		.pipe($.uglify())
		.pipe(gulp.dest(CONFIG.JS.DISTDIR))
		.pipe(browserSync.reload({stream:true}));
});




// gulp.task('watchify', function(callback) {
// 	// Start browserify task with devMode === true
// 	browserifyTask(callback, true);
// });




// Serve site, watch files for changes & reload
gulp.task('serve', ['styles', 'copy:css', 'browserify', 'copy:js', 'jekyll'], function () {
	browserSync({
		notify: false,
		// Customize the BrowserSync console logging prefix
		// logPrefix: 'WSK',
		// Run as an https by uncommenting 'https: true'
		// Note: this uses an unsigned certificate which on first access
		//       will present a certificate warning in the browser.
		// https: true,
		server: {
			baseDir: "./_site"
		}
	});

	gulp.watch([
			'./_includes/*.html',
			'./_layouts/*.html',
			'./_posts/*.md',
			'./_work/*.md',
			'./_blog/*.md',
			'./_lab/*.md',
			'./_drafts/*.md',
			'./work/**/*.html',
			'./blog/**/*.html',
			'./search/**/*.html',
			'./*.html'
		], ['jekyll']);
	gulp.watch(['scss/**/*.scss'], ['styles']);
	gulp.watch(['css/*.css'], ['copy:css']);
	gulp.watch(['js/**/*.js', '!js/dist/zander.js'], ['browserify']);
	gulp.watch(['js/dist/zander.js'], ['copy:js']);
	// gulp.watch(['img/**/*'], browserSync.reload);
});


// Build Production Files, the Default Task
gulp.task('default', function (cb) {
	runSequence('styles', ['jshint', 'js'], cb);
});


// Lint JavaScript
gulp.task('jshint', function () {
	return gulp.src(CONFIG.JS.FILELIST)
		.pipe(reload({stream: true, once: true}))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});
