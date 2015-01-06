var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');


var config = {
	vendorroot: 'www/lib/vendor/',
	approot: 'www/lib/app/',
	publiclib: 'www/public/lib/'
};

/************************************************************************/
// Run the delete to clean up old files first
var deleteFolders = [config.publiclib + 'fonts/*',
					config.publiclib + '*', 
					config.publiclib + 'style/*', 					
					config.publiclib + 'script/*'];

gulp.task('delete', function() {
  del.sync(deleteFolders);
});

/************************************************************************/
// concat our vendor scripts
var vendorScripts = [config.vendorroot + 'angular/angular.min.js', 
					config.vendorroot + 'jquery/dist/jquery.min.js', 
					config.vendorroot + 'bootstrap/dist/js/bootstrap.min.js'];

gulp.task('vendorscripts', function(){
	return gulp
		.src(vendorScripts)
    	.pipe(concat({ path: 'script/vendor.js'}))
		.pipe(gulp.dest(config.publiclib));
});

/************************************************************************/
// concat our vendor styles 
var vendorStyles = [config.vendorroot + 'bootstrap/dist/css/bootstrap.min.css', 
					config.vendorroot + 'fontawesome/css/font-awesome.min.css'];

gulp.task('vendorstyles', function(){
	return gulp
		.src(vendorStyles)
    	.pipe(concat({ path: 'style/vendor.css'}))
		.pipe(gulp.dest(config.publiclib));
});

/************************************************************************/
// concat our app scripts
var appScripts = [config.approot + 'mainmodule.js'];

gulp.task('appscripts', function(){
	return gulp
		.src(appScripts)
    	.pipe(concat({ path: 'script/app.js'}))
		.pipe(gulp.dest(config.publiclib));
});

/************************************************************************/
// copy our font files
var fontFiles = [config.vendorroot + 'bootstrap/dist/fonts/**.*', 
				config.vendorroot + 'fontawesome/fonts/**.*'];

gulp.task('fonts', function(){
	return gulp.src(fontFiles)
        .pipe(gulp.dest(config.publiclib + 'fonts'));
});

/************************************************************************/
// copy our dependent script files
var scriptDependencies = [config.vendorroot + 'jquery/dist/*.map',];

gulp.task('scriptDependencies', function(){
	return gulp.src(scriptDependencies)
        .pipe(gulp.dest(config.publiclib + 'script'));
});


/************************************************************************/
/************************************************************************/
// define our defaul gulp action
gulp.task('default', ['delete', 'vendorscripts', 'vendorstyles', 'appscripts', 'scriptDependencies', 'fonts']);