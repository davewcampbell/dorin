var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var sass = require("gulp-sass");


var config = {
	vendorroot: 'www/lib/vendor/',
	approot: 'www/lib/app/',
	publiclib: 'www/public/lib/'
};

/************************************************************************/
// Run the delete to clean up old files first
var deleteFolders = [config.publiclib + '*', 
					config.publiclib + 'style/*', 					
					config.publiclib + 'script/*',
					config.publiclib + 'fonts/*',
					config.publiclib + 'views/*'];

gulp.task('delete', function() {
  del.sync(deleteFolders);
});

/************************************************************************/
// concat our vendor scripts
var vendorScripts = [config.vendorroot + 'angular/angular.min.js', 
					config.vendorroot + 'angular-route/angular-route.min.js', 
					config.vendorroot + 'jquery/dist/jquery.min.js', 
					config.vendorroot + 'bootstrap/dist/js/bootstrap.min.js'];

gulp.task('vendorscripts', function(){
	return gulp
		.src(vendorScripts)
    	.pipe(plumber()) 
    	.pipe(jshint())
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
var appScripts = [config.approot + 'mainmodule.js',
					config.approot + 'purge/controllers/*.js',
					config.approot + 'purge/services/*.js',
					config.approot + 'purge/directives/*.js'];

gulp.task('appscripts', function(){
	return gulp
		.src(appScripts)
    	.pipe(plumber())    
    	.pipe(jshint())
    	.pipe(concat({ path: 'script/app.js'}))
		.pipe(gulp.dest(config.publiclib));
});
/************************************************************************/
// concat our app styles
var appStyles = [config.approot + 'style/site.scss'];

gulp.task('appstyles', function(){
	return gulp
		.src(config.approot + 'style/*.scss')
		.pipe(sass({sourcemap: true}))
		.on('error', function(error){
			console.log(error);
			this.emit('end');
		})
		//.pipe(concat({ path: 'style/app.css'}))
		.pipe(gulp.dest(config.publiclib));
});

/************************************************************************/
// copy our angular view files
var ngViewFiles = [config.approot + 'purge/views/**.*'];

gulp.task('views', function(){
	return gulp.src(ngViewFiles)
        .pipe(gulp.dest(config.publiclib + 'views/purge'));
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
var scriptDependencies = [config.vendorroot + 'jquery/dist/*.map',
						config.vendorroot + 'angular/*.map',
						config.vendorroot + 'angular-route/*.map'];

gulp.task('scriptDependencies', function(){
	return gulp.src(scriptDependencies)
        .pipe(gulp.dest(config.publiclib + 'script'));
});


/************************************************************************/
/************************************************************************/
// define our defaul gulp action
gulp.task('default', [	'delete', 
						'vendorscripts', 
						'vendorstyles', 
						'appscripts',
						//'appstyles',
						'views', 
						'scriptDependencies', 
						'fonts'
					]);