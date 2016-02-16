'use strict';

var gulp = require('gulp');
var path = require('path');
var paths = require('./paths.conf');
var $ = require('gulp-load-plugins')();

gulp.task('lint.server', function() {
    return gulp.src(paths.server.ts)
        .pipe($.tslint())
        .pipe($.tslint.report($.tslintStylish, {
            emitError: false
        }));
});

gulp.task('build.server', ['lint.server'], function() {
    var tsProject = $.typescript.createProject(paths.server.tsconfig);
    var tsResult = tsProject.src()
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist.server));
});

gulp.task('watch.server', ['build.server'], function() {
    $.nodemon({
        script: paths.dist.www,
        watch: path.join(__dirname, paths.server.ts), // TODO
        env: { 'NODE_ENV': 'development' },
        tasks: ['build.server']
    });
});

gulp.task('default', ['watch.server']);
