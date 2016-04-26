'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();

gulp.task('lint.client', function() {
    return gulp.src(['./src/client/**/*.ts', '!./src/client/**/*.d.ts'])
        .pipe($.tslint())
        .pipe($.tslint.report($.tslintStylish, {
            emitError: false
        }));
});

gulp.task('lint.server', function() {
    return gulp.src(['./src/server/**/*.ts', '!./src/server/**/*.d.ts'])
        .pipe($.tslint())
        .pipe($.tslint.report($.tslintStylish, {
            emitError: false
        }));
});

function processor(ext, file) {
    switch (ext[0]) {
        case '.css':
            file = file.replace(/((?=[:;,{}>]).|^)\s+|\s+(?=[{>])/g, '$1');
            break;

        case '.html':
            file = file.replace(/>\s+</g, '><');
            break;
    }

    return file;
}

gulp.task('dist.client', ['dist.client.css', 'dist.client.html', 'dist.client.img', 'dist.client.vendor'], function() {
    var tsProject = $.typescript.createProject('./src/client/tsconfig.json');
    var tsResult = tsProject.src()
        .pipe($.sourcemaps.init())
        .pipe($.inlineNg2Template({
            base: './src/client',
            indent: 0,
            useRelativePaths: true,
            removeLineBreaks: true,
            templateProcessor: processor,
            styleProcessor: processor
        }))
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.uglify({
            preserveComments: 'license'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('dist.client.css', function() {
    return gulp.src('./src/client/assets/main.css')
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer())
        .pipe($.cssnano())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/client/assets'));
});

gulp.task('dist.client.html', function() {
    return gulp.src('./src/client/index.html')
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('dist.client.img', function() {
    return gulp.src('./src/client/assets/**/*.@(png|jpg|gif|svg)')
        .pipe($.imagemin())
        .pipe(gulp.dest('./dist/client/assets'));
});

gulp.task('dist.client.vendor', function() {
    return gulp.src([
        './node_modules/es6-shim/es6-shim.@(map|min.js)',
        './node_modules/systemjs/dist/system-polyfills.@(js|js.map)',
        './node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
        './node_modules/angular2/bundles/angular2-polyfills.js',
        './node_modules/systemjs/dist/system.src.js',
        './node_modules/rxjs/bundles/Rx.js',

        './node_modules/angular2/bundles/angular2.dev.js',
        './node_modules/angular2/bundles/http.dev.js',
        './node_modules/angular2/bundles/router.dev.js'
    ], {base: './node_modules'})
        .pipe(gulp.dest('./dist/client/vendor'));
});

gulp.task('dist.server', function() {
    var tsProject = $.typescript.createProject('./src/server/tsconfig.json');
    var tsResult = tsProject.src()
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/server'));
});

gulp.task('watch.server', ['lint.server', 'dist.server'], function() {
    $.nodemon({
        script: './dist/server/bin/www.js',
        watch: path.join(__dirname, './src/server/**/*.ts'),
        env: { 'NODE_ENV': 'development' },
        tasks: ['lint.server', 'dist.server']
    });
});

gulp.task('default', ['watch.server']);
