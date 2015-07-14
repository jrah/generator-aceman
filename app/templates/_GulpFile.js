// # main

var gulp = require('gulp');

// # plugins

var sass =  require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    zip = require('gulp-zip'),
    browserSync = require('browser-sync').create();

// # var

// ## source paths
var srcDir = 'src/';
var scssDir = srcDir + 'scss/';
var jsDir = srcDir + 'js/';


// ## Theme for WordPress
var projectName = "<%= themename %>";
var themeName = '_' + projectName;
var themeDir = 'themes/' + themeName + '/';

// ### WP Metadata
var banner = [
'/*',
' * Theme Name: <%= themename %>',
' * Theme URI: <%= themeuri %>',
' * Author: <%= author %>',
' * Author URI: <%= authoruri %>',
' * Description: <%= themedescription %>',
' * Version: 1.0',
' * License: GNU General Public License v2 or later',
' * License URI: http://www.gnu.org/licenses/gpl-2.0.html',
' * Tags: ',
' * GPL license',
' */',
''].join('\n');

// ## CSS theme location
var cssDir  = themeDir;


// # browser-sync server

gulp.task('browser-sync', function() {
  browserSync({
    proxy: "<%= devurl %>"
  });
});

gulp.task('concatScripts', function(){
  return gulp.src([
    'bower_components/...',
    'src/js/app.js'
  ]).pipe(concat("app.js"))
  .pipe(gulp.dest(themeDir + 'js/'))
});

gulp.task('minifyScripts', ['concatScripts'], function(){
  return gulp.src(jsDir + 'app.js')
  .pipe(uglify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest(themeDir + 'js/'))
  .pipe(browserSync.stream({match: themeDir + '**/*.js'}));
});

gulp.task('minifyCSS', function(){
  return gulp.src(themeDir + 'style.css')
  .pipe(minifyCSS())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest(themeDir +'css/'))
  .pipe(browserSync.stream({match: themeDir + '**/*.css'}));
});


// ## default dependent on scss
gulp.task('scss', function(){
  return sass(scssDir + 'style.scss', {sourcemap: true } )
  .on('error', function(err){
    console.error('Error!', err.message);
  })
  .pipe(sourcemaps.write('./', {
    includeContent: false,
    sourceRoot: scssDir + 'style.scss'
  }))
  .pipe(gulp.dest(themeDir))
  .pipe(browserSync.stream({match: themeDir + '**/*.css'}));
});

// build and zip theme

gulp.task('build-zip', ['minifyScripts', 'minifyCSS'], function(){
  return gulp.src(themeDir, { base: './'});
  .pipe(zip('<%= themename %>'))
  .pipe(gulp.dest('dist'));
  })

gulp.task('build', ['minifyScripts', 'minifyCSS'], function(){
  return gulp.src(themeDir, { base: './'});
  .pipe(gulp.dest('dist'));
  })

// compile sass, watch directory for browser sync
gulp.task('default', ['sass'], function () {
  .browserSync.init({
    proxy: "<%= devurl %>"
  });
  // watch sass and php directory
  gulp.watch(scssDir + '**/**/*.scss', ['sass']);
  gulp.watch(themeDir + '/*.php').on('change', browserSync.reload);
});

