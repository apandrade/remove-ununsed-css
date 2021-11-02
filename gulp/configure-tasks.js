const gulp = require('gulp'),
      purgecss = require('gulp-purgecss'),
      concat = require('gulp-concat'),
      minifyCSS = require('gulp-minify-css');

module.exports = (rootFolder, resultFolder) => {
    gulp.task("Purge CSS", () => {
        return gulp.src(`${rootFolder}/css/*.css`)
            .pipe(purgecss({
                content: [`${rootFolder}/*.html`]
            }))
            .pipe(gulp.dest(resultFolder))
    })
    gulp.task("Combine CSS", () => {
        return gulp.src(`${rootFolder}/css/*.css`)
            .pipe(minifyCSS())
            .pipe(concat('combined-styles.min.css'))
            .pipe(gulp.dest(resultFolder))
    });
    return Object.keys(gulp.registry().tasks());
}