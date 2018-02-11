const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('workflow', () => {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('default', ['workflow'], () => {
    gulp.watch('./src/sass/**/*.scss', ['workflow']);
});