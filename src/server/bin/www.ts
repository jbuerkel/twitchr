#!/usr/bin/env node
'use strict';

import app from '../app';
import {createServer} from 'http';

let port: number = process.env.PORT || 9000;
app.set('port', port);
let server = createServer(app);

server.listen(port);

server.on('error', (err: any) => {
    if (err.syscall !== 'listen') {
        throw err;
    }

    switch (err.code) {
        case 'EACCES':
            console.error('Port ' + port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error('Port ' + port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw err;
    }
});

server.on('listening', () => {
    let addr = server.address();
    console.log('Listening on port ' + addr.port);
});
