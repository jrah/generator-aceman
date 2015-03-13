// # main

var gulp = require('gulp');

// # plugins

var sass =  require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload

// # declare location variables

// ## Sass
var srcDir = 'src/';
var scssDir = srcDir + 'scss/';


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


// # sass compile
gulp.task('sass', function() {
  // locates Sass
  return gulp.src(scssDir + '*.scss')
  // source maps none is true
  .pipe(sass({'sourcemap=none': true}))
    // outputs CSS
   .pipe(gulp.dest(cssDir))
   .pipe(notify("Sass has compiled!"))
   // reloads the browser
   .pipe(reload({stream:true}));
});

gulp.task('build', function() {
  // locates Sass
  return gulp.src(scssDir + '*.scss')
  // source maps none is true
  .pipe(sass({'sourcemap=none': true, style: 'compressed'}))
  // .pipe(minifyCSS({ keepSpecialComments: 1 }))
    // outputs CSS but before inject banner
    .pipe(header(banner))
   .pipe(gulp.dest(cssDir))

   .pipe(notify("Sass has compiled!"))
   // reloads the browser
   .pipe(reload({stream:true}));
});

// compile sass, watch directory for browser sync
gulp.task('default', ['sass','browser-sync'], function () {
  // watch sass directory
  gulp.watch(scssDir + '**/**/*.scss', ['sass']);
  gulp.watch(scssDir + '/'+ themeName + '/*.php');

});