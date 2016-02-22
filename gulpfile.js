'use strict';

var gulp = require('gulp');
var path = require('path');
var paths = require('./paths.conf');
var $ = require('gulp-load-plugins')();

gulp.task('json.server', function() {
    return gulp.src(paths.server.json)
        .pipe($.changed(paths.dist.server))
        .pipe(gulp.dest(paths.dist.server));
});

gulp.task('lint.server', function() {
    return gulp.src([paths.server.ts, paths.server.noTypings])
        .pipe($.tslint())
        .pipe($.tslint.report($.tslintStylish, {
            emitError: false
        }));
});

gulp.task('build.server', ['json.server', 'lint.server'], function() {
    var tsProject = $.typescript.createProject(paths.server.tsConfig);
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
        watch: path.join(__dirname, paths.server.ts),
        env: { 'NODE_ENV': 'development' },
        tasks: ['build.server']
    });
});

gulp.task('default', ['watch.server']);
