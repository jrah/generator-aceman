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
var projectName = "Theme";
var themeName = '_' + projectName;
var themeDir = 'themes/' + themeName + '/';


// ## CSS theme location
var cssDir  = themeDir;


// # browser-sync server

gulp.task('browser-sync', function() {
  browserSync({
    proxy: "domain.dev"
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


// compile sass, watch directory for browser sync
gulp.task('default', ['sass','browser-sync'], function () {
  // watch sass directory
  gulp.watch(scssDir + '**/**/*.scss', ['sass']);
  gulp.watch(scssDir + '/'+ themeName + '/*.php');

});