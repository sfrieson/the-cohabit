var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
gulp.task('default', ['browserSync', 'watch'], () => {
  console.log("\n\n _____ _             ____      _           _     _ _   \n|_   _| |__   ___   / ___|___ | |__   __ _| |__ (_) |_ \n  | | | '_ \\ / _ \\ | |   / _ \\| '_ \\ / _` | '_ \\| | __|\n  | | | | | |  __/ | |__| (_) | | | | (_| | |_) | | |_ \n  |_| |_| |_|\\___|  \\____\\___/|_| |_|\\__,_|_.__/|_|\\__|\n\n");
});

gulp.task('browserSync', ['sass'], function () {
  browserSync.init({
    server: {
      // baseDir: './'
    }
  });
});

gulp.task('sass', () => {
  return gulp.src('app/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('css'))
  .pipe(browserSync.reload({
    stream: true
  }));
});
gulp.task('js', () => {
  return gulp.src('app/js/**/*.js')
  .pipe(gulp.dest('js'))
  .pipe(browserSync.reload({
    stream: true
  }));
});
gulp.task('html', () => {
  return gulp.src('app/**/*.html')
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('watch', () => {
  gulp.watch(['app/scss/**/*.scss', '!app/scss/variables.scss'], ['sass']);
  gulp.watch('app/*.html', ['html']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('*.+(html|css|js)', browserSync.reload);
});
