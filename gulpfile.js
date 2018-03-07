const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('workflow', () => {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['workflow'], () => {
    gulp.watch('./src/sass/**/*.scss', ['workflow']);
});