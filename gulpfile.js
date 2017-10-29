var gulp = require('gulp'),
//build/js
del = require('del'),
usemin = require('gulp-usemin'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
webpack = require('webpack'),
//BrowserSync
browserSync = require('browser-sync').create(),
//CSS
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssImport = require('postcss-import'),
//Watch
watch = require('gulp-watch'),
//Build
rev = require('gulp-rev');

gulp.task('watch', function() {

  browserSync.init({
    notify: false,
    server: {
      baseDir: "app"
    }
  });

  watch('./app/index.html', function() {
    browserSync.reload();
  });

  watch('./app/assets/styles/**/*.css', function() {
    gulp.start('cssInject');
  });

  watch('./app/assets/scripts/**/*.js', function() {
    gulp.start('scriptsRefresh');
  });

});

gulp.task('cssInject', ['styles'], function() {
  return gulp.src('./app/temp/styles/styles.css')
    .pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', ['scripts'], function() {
  browserSync.reload();
});

gulp.task('styles', function() {
  return gulp.src('./app/assets/styles/styles.css')
    .pipe(postcss([cssImport, autoprefixer]))
    .on('error', function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('./app/temp/styles'));
});

gulp.task('scripts', function(callback) {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }

    console.log(stats.toString());
    callback();
  });
});

gulp.task("previewDist", function(){
	browserSync.init({
	    notify: false,
	    server: {
	      baseDir: "dist"
	    }
	});
});

gulp.task("deleteDistFolder", function(){
	return del("./dist");
});

gulp.task("usemin", ["deleteDistFolder", "styles", "scripts"], function(){
	return gulp.src("./app/index.html")
	.pipe(usemin({
		css: [function(){return rev();}, function(){return cssnano();}],
		js: [function(){return rev();}, function(){return uglify();}]
	}))
	.pipe(gulp.dest("./docs"));
});

gulp.task("build", ["deleteDistFolder", "usemin"]); 

