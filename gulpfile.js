'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cssnano = require('cssnano');
var htmlMinifier = require('html-minifier');
var resolve = require('app-root-path').resolve;
var $ = require('gulp-load-plugins')();

function templateProcessor(ext, file, cb) {
    try {
        var minifiedFile = htmlMinifier.minify(file, {
            caseSensitive: true,
            collapseWhitespace: true
        });

        cb(null, minifiedFile);
    } catch (err) {
        cb(err);
    }
}

function styleProcessor(ext, file, cb) {
    try {
        cssnano.process(file).then(function(result) {
            cb(null, result.css);
        });
    } catch (err) {
        cb(err);
    }
}

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

gulp.task('dist.client', ['dist.client.css', 'dist.client.html', 'dist.client.img', 'dist.client.ts', 'dist.client.vendor']);

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
        .pipe($.htmlmin({
            caseSensitive: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('dist.client.img', function() {
    return gulp.src('./src/client/assets/**/*.@(png|jpg|gif|svg|ico)')
        .pipe($.imagemin())
        .pipe(gulp.dest('./dist/client/assets'));
});

gulp.task('dist.client.ts', function() {
    var tsProject = $.typescript.createProject('./tsconfig.json', {
        module: 'system',
        moduleResolution: 'node'
    });

    var tsResult = gulp.src(['./src/client/**/*.ts', './src/typings/**/*.d.ts', './typings/index.d.ts'])
        .pipe($.sourcemaps.init())
        .pipe($.inlineNg2Template({
            base: './src/client',
            indent: 0,
            useRelativePaths: true,
            removeLineBreaks: true,
            templateProcessor: templateProcessor,
            styleProcessor: styleProcessor
        }))
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.uglify({
            preserveComments: 'license'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('dist.client.vendor', function() {
    return gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.min.@(css|css.map)',

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

gulp.task('dist.plugins', ['dist.plugins.json', 'dist.plugins.ts']);

gulp.task('dist.plugins.json', function() {
    return gulp.src('./src/plugins/twitchr-*/package.json')
        .pipe(gulp.dest('./dist/plugins'));
});

gulp.task('dist.plugins.ts', function() {
    var tsProject = $.typescript.createProject('./tsconfig.json', {
        module: 'commonjs'
    });

    var tsResult = gulp.src(['./src/plugins/twitchr-*/index.ts', './src/typings/**/*.d.ts', './typings/index.d.ts'])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/plugins'));
});

gulp.task('dist.server', ['dist.server.ts']);

gulp.task('dist.server.ts', function() {
    var tsProject = $.typescript.createProject('./tsconfig.json', {
        module: 'commonjs'
    });

    var tsResult = gulp.src(['./src/server/**/*.ts', './src/typings/**/*.d.ts', './typings/index.d.ts'])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));

    return tsResult.js
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/server'));
});

gulp.task('dev', ['dev.client'], function() {
    gulp.watch('./src/client/assets/main.css', ['dist.client.css']);
    gulp.watch('./src/client/index.html', ['dist.client.html']);
    gulp.watch('./src/client/assets/**/*.@(png|jpg|gif|svg|ico)', ['dist.client.img']);
    gulp.watch('./src/client/@(main.ts|app/**/*.@(ts|html|css))', ['dist.client.ts']);
});

gulp.task('dev.client', ['dev.server'], function() {
    var port = process.env.PORT || 8443;
    browserSync.init({
        ui: false,
        files: './dist/client',
        proxy: 'https://localhost:' + port,
        port: port + 1,
        online: false,
        notify: false,
        reloadDelay: 500,
        minify: false
    });
});

gulp.task('dev.server', ['dist.client', 'dist.plugins', 'dist.server'], function() {
    $.nodemon({
        script: './dist/server/bin/https.js',
        watch: resolve('@(./src/server/**/*.ts|./src/plugins/twitchr-*/@(index.ts|package.json))'),
        env: {NODE_ENV: 'development'},
        tasks: ['dist.plugins', 'dist.server']
    }).on('restart', browserSync.reload);
});

gulp.task('default', ['dev']);
