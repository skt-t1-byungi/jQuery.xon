var gulp = require('gulp');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

gulp.task('build', function() {
    return gulp.src('./jquery.xon.js')
    .pipe(uglify({preserveComments : 'license'}))
    .pipe(rename('jquery.xon.min.js'))
    .pipe(gulp.dest('./'));
});