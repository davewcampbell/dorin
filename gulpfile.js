var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var sass = require("gulp-sass");


var config = {
	vendorRoot: 'www/lib/vendor/',
	appRoot: 'www/lib/app/',
	styleRoot: 'www/lib/style/',
	publicLib: 'www/public/lib/'
};

/************************************************************************/
// Run the delete to clean up old files first
var deleteFolders = [config.publicLib + '*',
					config.publicLib + 'style/*',
					config.publicLib + 'script/*',
					config.publicLib + 'fonts/*',
					config.publicLib + 'views/*'];

gulp.task('delete', function() {
  del.sync(deleteFolders);
});

/************************************************************************/
// concat our vendor scripts
var vendorScripts = [config.vendorRoot + 'angular/angular.min.js',
					config.vendorRoot + 'angular-toastr/dist/angular-toastr.min.js',
					config.vendorRoot + 'angular-route/angular-route.min.js',
					config.vendorRoot + 'jquery/dist/jquery.min.js',
					config.vendorRoot + 'bootstrap/dist/js/bootstrap.min.js'];

gulp.task('vendorScripts', function(){
	return gulp
		.src(vendorScripts)
    	.pipe(plumber())
    	.pipe(jshint())
    	.pipe(concat({ path: 'script/vendor.js'}))
		.pipe(gulp.dest(config.publicLib));
});

/************************************************************************/
// concat our vendor styles 
var vendorStyles = [config.vendorRoot + 'bootstrap/dist/css/bootstrap.min.css',
					config.vendorRoot + 'fontawesome/css/font-awesome.min.css',
					config.vendorRoot + 'angular-toastr/dist/angular-toastr.min.css'];

gulp.task('vendorStyles', function(){
	return gulp
		.src(vendorStyles)
    	.pipe(concat({ path: 'style/vendor.css'}))
		.pipe(gulp.dest(config.publicLib));
});

/************************************************************************/
// concat our app scripts
var appScripts = [config.appRoot + 'mainmodule.js',
					config.appRoot + 'services/*.js',
					config.appRoot + 'job/controllers/*.js',
					config.appRoot + 'job/services/*.js',
					config.appRoot + 'job/directives/*.js'];

gulp.task('appScripts', function(){
	return gulp
		.src(appScripts)
    	.pipe(plumber())    
    	.pipe(jshint())
    	.pipe(concat({ path: 'script/app.js'}))
		.pipe(gulp.dest(config.publicLib));
});
/************************************************************************/
// concat our app styles
var appStyles = [config.appRoot + 'style/site.scss'];

gulp.task('appStyles', function(){
	return gulp
		.src(config.styleRoot + '*.scss')
		.pipe(sass())
		.on('error', function(error){
			console.log(error);
			this.emit('end');
		})
		.pipe(minifyCSS())
		.pipe(concat({ path: 'style/app.css'}))
		.pipe(gulp.dest(config.publicLib));
});

/************************************************************************/
// copy our angular view files
var ngViewFiles = [config.appRoot + 'job/views/**.*'];

gulp.task('views', function(){
	return gulp.src(ngViewFiles)
        .pipe(gulp.dest(config.publicLib + 'views/job'));
});

/************************************************************************/
// copy our font files
var fontFiles = [config.vendorRoot + 'bootstrap/dist/fonts/**.*',
				config.vendorRoot + 'fontawesome/fonts/**.*'];

gulp.task('fonts', function(){
	return gulp.src(fontFiles)
        .pipe(gulp.dest(config.publicLib + 'fonts'));
});

/************************************************************************/
// copy our dependent script files
var scriptDependencies = [config.vendorRoot + 'jquery/dist/*.map',
						config.vendorRoot + 'angular/*.map',
						config.vendorRoot + 'angular-route/*.map'];

gulp.task('scriptDependencies', function(){
	return gulp.src(scriptDependencies)
        .pipe(gulp.dest(config.publicLib + 'script'));
});


/************************************************************************/
/************************************************************************/
// define our defaul gulp action
gulp.task('default', [	'delete', 
						'vendorScripts',
						'vendorStyles',
						'appScripts',
						'appStyles',
						'views', 
						'scriptDependencies', 
						'fonts'
					]);