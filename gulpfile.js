const gulp = require('gulp')
const sass = require('gulp-sass')
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')

/*
Task for transforming Sass into browser readable css.

1. Transform SCSS.
2. Prefix evertything that is needed.
3. Minify the css.
4. Send the resulting file to the public folder, for the browser to make use of.
*/

gulp.task('transformSCSS', () => {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest('./public/'))
});

gulp.task('default', ['transformSCSS'], () => {
    gulp.watch('./src/sass/**/*.scss', ['transformSCSS'])
});