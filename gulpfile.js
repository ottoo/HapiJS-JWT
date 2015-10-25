var gulp = require('gulp');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var PATHS = {
  entry: './src/scripts/app.js',
  buildFile: 'build.js',
  DEV: {
    images: 'src/images/**/*',
    styles: 'src/styles/**/*.scss',
    buildDest: 'dist/src/'
  },
  PROD: {
    images: 'dist/images/',
    styles: 'dist/styles/',
    buildDest: 'dist/build/'
  }
};

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src(PATHS.DEV.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(PATHS.PROD.styles));
});

gulp.task('styles', function(){
  gulp.src([PATHS.DEV.styles])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(PATHS.PROD.styles))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts:development', function(){
  var watcher = watchify(browserify({
    entries: [PATHS.entry],
    transform: [babelify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function() {
    watcher.bundle()
      .pipe(source(PATHS.buildFile))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(PATHS.buildDest))
      .pipe(browserSync.reload({stream:true}))
      console.log('Updated');
  })
  .bundle()
    .pipe(source(PATHS.buildFile))
    .pipe(gulp.dest(PATHS.buildDest));

});

gulp.task('scripts:production', function(){
  var b = browserify({
    entries: [PATHS.entry],
    transform: [babelify],
    debug: false,
    cache: {}, packageCache: {}, fullPaths: true
  });

  return b.bundle()
    .pipe(source(PATHS.buildFile))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(PATHS.PROD.buildDest));

});

gulp.task('default', ['browser-sync', 'scripts'], function(){
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("*.html", ['bs-reload']);
});

gulp.task('build', ['images', 'styles', 'scripts:production']);
