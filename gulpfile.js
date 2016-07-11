var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
gulp.task('default', ['browserSync', 'watch'], () => {
  console.log("\n\n _____ _             ____      _           _     _ _   \n|_   _| |__   ___   / ___|___ | |__   __ _| |__ (_) |_ \n  | | | '_ \\ / _ \\ | |   / _ \\| '_ \\ / _` | '_ \\| | __|\n  | | | | | |  __/ | |__| (_) | | | | (_| | |_) | | |_ \n  |_| |_| |_|\\___|  \\____\\___/|_| |_|\\__,_|_.__/|_|\\__|\n\n");
});

gulp.task('browserSync', ['sass'], function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('sass', () => {
  return gulp.src('app/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('watch', () => {
  gulp.watch(['app/scss/**/*.scss', '!app/scss/variables.scss'], ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
