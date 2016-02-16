/* jshint node: true */
'use strict';

import * as app from '../app';
import * as http from 'http';

var port: number = process.env.PORT || 9000;
app.set('port', port);
var server = http.createServer(app);

server.listen(port);

server.on('error', (err: any) => {
    if(err.syscall !== 'listen') throw err;
    switch(err.code) {
        case 'EACCES':
            console.error(port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw err;
    }
});

server.on('listening', () => {
    var addr = server.address();
    console.log('Listening on port ' + addr.port);
});
