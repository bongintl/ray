var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    gulp.src('sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
			browsers: ['>1%']
		}))
        .pipe(gulp.dest('.'))
        
})

var browserify = require('browserify');

var watchify = require('watchify');

watchify.args.entries = ['./js/main.js'];
watchify.args.debug = true;

var b = watchify( browserify( watchify.args ) );

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var stringify = require('stringify');
var streamify = require('gulp-streamify');

b.on('update', bundle);
b.on('log', gutil.log);

b.transform('browserify-shader');

b.transform(stringify, {
	appliesTo: { includeExtensions: ['.html', '.svg'] }
})

// b.transform( 'babelify', { presets: ['es2015'] } )

gulp.task( 'js', bundle );

function bundle () {
	
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error:'))
		.pipe( source('./bundle.js') )
		.pipe( buffer() )
		// .pipe( streamify( uglify() ) )
	    .pipe(gulp.dest('./'));
		
}

gulp.task('default', ['sass', 'js'], function() {
	gulp.watch('./sass/**/*', ['sass']);
});
