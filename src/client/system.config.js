(function(global) {

    var map = {
        'app': 'app',
        '@angular': 'vendor/@angular'
    };

    var packages = {
        'app': { main: 'main.js', defaultExtension: 'js' }
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
        paths: { 'rxjs/*': 'vendor/rxjs/bundles/Rx.umd.min.js' },
        map: map,
        packages: packages
    };

    System.config(config);

})(this);
