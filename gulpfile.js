'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const Builder = require('systemjs-builder');
const cssnano = require('cssnano');
const htmlMinifier = require('html-minifier');
const postcss = require('postcss');
const resolve = require('app-root-path').resolve;

function templateProcessor(path, ext, file, cb) {
    try {
        const minifiedFile = htmlMinifier.minify(file, {
            caseSensitive: true,
            collapseWhitespace: true
        });

        cb(null, minifiedFile);
    } catch (err) {
        cb(err);
    }
}

function styleProcessor(path, ext, file, cb) {
    try {
        postcss([ autoprefixer, cssnano ]).process(file)
            .then(result => cb(null, result.css));
    } catch (err) {
        cb(err);
    }
}

gulp.task('lint', [ 'lint.client', 'lint.server' ]);

gulp.task('lint.client', () => {
    return gulp.src('./src/client/**/*.ts')
        .pipe($.tslint())
        .pipe($.tslint.report({
            emitError: false
        }));
});

gulp.task('lint.server', () => {
    return gulp.src('./src/server/**/*.ts')
        .pipe($.tslint())
        .pipe($.tslint.report({
            emitError: false
        }));
});

gulp.task('dist', [ 'dist.client', 'dist.server' ]);

gulp.task('dist.client', [ 'dist.client.css', 'dist.client.html', 'dist.client.img', 'dist.client.ts', 'dist.client.vendor' ]);

gulp.task('dist.client.css', () => {
    return gulp.src('./src/client/css/main.css')
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer())
        .pipe($.cssnano())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/client/css'));
});

gulp.task('dist.client.html', () => {
    return gulp.src('./src/client/index.html')
        .pipe($.inlineSource({
            compress: false
        }))
        .pipe($.htmlmin({
            caseSensitive: true,
            collapseWhitespace: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('dist.client.img', () => {
    return gulp.src('./src/client/assets/**/*.@(png|jpg|gif|svg|ico)')
        .pipe($.imagemin())
        .pipe(gulp.dest('./dist/client/assets'));
});

gulp.task('dist.client.ts', () => {
    const tsProject = $.typescript.createProject('./tsconfig.json', {
        moduleResolution: 'node'
    });

    const tsResult = gulp.src([ './src/client/**/*.ts', './src/typings/**/*.d.ts' ])
        .pipe($.sourcemaps.init())
        .pipe($.inlineNg2Template({
            base: './src/client',
            indent: 0,
            useRelativePaths: true,
            removeLineBreaks: true,
            templateProcessor: templateProcessor,
            styleProcessor: styleProcessor
        }))
        .pipe(tsProject());

    return tsResult.js
        .pipe($.uglify({
            preserveComments: 'license'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('dist.client.vendor', [ 'dist.client.bundle.rxjs' ], () => {
    return gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.min.@(css|css.map)',

        './node_modules/core-js/client/shim.min.@(js|js.map)',

        './node_modules/zone.js/dist/zone.min.js',
        './node_modules/reflect-metadata/Reflect.@(js|js.map)',
        './node_modules/systemjs/dist/system.@(js|js.map)',

        './node_modules/@angular/*/bundles/*.umd.min.js'
    ], { base: './node_modules' })
        .pipe(gulp.dest('./dist/client/vendor'));
});

gulp.task('dist.client.bundle.rxjs', done => {
    const options = {
        normalize: true,
        runtime: false,
        sourceMaps: true,
        sourceMapContents: true,
        minify: true,
        mangle: false
    };

    const builder = new Builder('./');

    builder.config({
        paths: {
            'n:*': 'node_modules/*',
            'rxjs/*': 'node_modules/rxjs/*.js'
        },
        map: {
            'rxjs': 'n:rxjs'
        },
        packages: {
            'rxjs': { main: 'Rx.js', defaultExtension: 'js' }
        }
    });

    builder.bundle('rxjs', './dist/client/vendor/rxjs/bundles/Rx.min.js', options)
        .then(() => done())
        .catch(err => done(err));
});

gulp.task('dist.server', [ 'dist.server.ts' ]);

gulp.task('dist.server.ts', () => {
    const tsProject = $.typescript.createProject('./tsconfig.json');
    const tsResult = gulp.src([ './src/server/**/*.ts', './src/typings/**/*.d.ts' ])
        .pipe($.sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/server'));
});

gulp.task('dev', [ 'dev.client' ], () => {
    gulp.watch('./src/client/css/main.css',                       [ 'dist.client.css'  ]);
    gulp.watch('./src/client/index.html',                         [ 'dist.client.html' ]);
    gulp.watch('./src/client/assets/**/*.@(png|jpg|gif|svg|ico)', [ 'dist.client.img'  ]);
    gulp.watch('./src/client/app/**/*.@(ts|html|css)',            [ 'dist.client.ts'   ]);
});

gulp.task('dev.client', [ 'dev.server' ], () => {
    const protocol = process.env.USE_TLS === 'true' ? 'https' : 'http';

    browserSync.init({
        ui: false,
        files: './dist/client',
        proxy: protocol + '://localhost:3000',
        port: 3030,
        online: false,
        open: false,
        notify: false,
        reloadDelay: 500,
        minify: false,
        socket: {
            domain: protocol + '://localhost:3000'
        }
    });
});

gulp.task('dev.server', () => {
    $.nodemon({
        script: './dist/server/bin/www.js',
        watch: resolve('./src/server/**/*.ts'),
        tasks: [ 'dist.server' ]
    }).on('restart', browserSync.reload);
});

gulp.task('default', [ 'dev' ]);
