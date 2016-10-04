(function(global) {
    System.config({
        paths: {
            'npm:':   'vendor/'
        },

        map: {
            'app':                               'app',
            '@angular/common':                   'npm:@angular/common/bundles/common.umd.min.js',
            '@angular/compiler':                 'npm:@angular/compiler/bundles/compiler.umd.min.js',
            '@angular/core':                     'npm:@angular/core/bundles/core.umd.min.js',
            '@angular/http':                     'npm:@angular/http/bundles/http.umd.min.js',
            '@angular/platform-browser':         'npm:@angular/platform-browser/bundles/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
            '@angular/router':                   'npm:@angular/router/bundles/router.umd.min.js'
        },

        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            }
        }
    });
})(this);
