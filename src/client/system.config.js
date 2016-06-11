(function() {
    'use strict';

    var map = {
        'app':      'app',
        'rxjs':     'vendor/rxjs',
        '@angular': 'vendor/@angular'
    };

    var packages = {
        'app':      { main: 'main.js', defaultExtension: 'js' },
        'rxjs':     { defaultExtension: 'js' }
    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router-deprecated'
    ];

    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }

    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
    }

    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    ngPackageNames.forEach(setPackageConfig);

    var config = {
        map: map,
        packages: packages
    };

    System.config(config);
})();
