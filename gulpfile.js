var gulp = require ('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),
    imagemin = require('gulp-imagemin'),
    prefix = require('gulp-autoprefixer');

function errorLog(error){
  console.error(error.message);
}

// Scripts Task
//Uglifies
gulp.task('scripts', function(){
  //minifies bootstrap js
  gulp.src('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js')
    .pipe(uglify())
    .on('error', errorLog)
    .pipe(gulp.dest('public/js/'));
  gulp.src('js/*.js')
    .pipe(uglify())
    .on('error', errorLog)
    .pipe(gulp.dest('public/js/'));
});

// Scripts Task
//Styles
gulp.task('styles', function(){
  return sass('scss/*.scss', {style: 'compressed'})
    .on('error', errorLog)
    .pipe(prefix({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('watch', function(){
  gulp.watch('scss/*.scss',['styles']);
  gulp.watch('js/*.js',['scripts']);
});

//Image Task
//Compress
gulp.task('image', function(){
  gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images/'));
});

gulp.task('default', [
  'watch',
  'scripts',
  'styles'
]);
