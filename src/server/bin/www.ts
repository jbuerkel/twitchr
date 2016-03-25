#!/usr/bin/env node
'use strict';

import * as express from 'express';
import {createServer as createServerHttp} from 'http';
import {createServer as createServerHttps} from 'https';
import {readFileSync} from 'fs';
import {resolve} from 'app-root-path';
import app from '../app';

let httpApp = express();
let httpPort = 8080;
let httpsPort = process.env.PORT || 8443;

let options = {
    cert: readFileSync(resolve('./cert/cert.pem')),
    key: readFileSync(resolve('./cert/key.pem'))
};

app.set('port', httpsPort);
httpApp.set('port', httpPort);
httpApp.get('*', (req: express.Request, res: express.Response) => {
    res.redirect(301, `https://${req.hostname}:${httpsPort + req.url}`);
});

let httpServer = createServerHttp(httpApp);
let httpsServer = createServerHttps(options, app);
httpServer.listen(httpPort);
httpsServer.listen(httpsPort);

httpServer.on('error', (err: any) => {
    error(err, false);
});

httpsServer.on('error', (err: any) => {
    error(err, true);
});

httpServer.on('listening', () => {
    listening(false);
});

httpsServer.on('listening', () => {
    listening(true);
});

function error(err: any, secure: boolean) {
    let port = secure ? httpsPort : httpPort;
    let protocol = secure ? 'HTTPS' : 'HTTP';

    if (err.syscall !== 'listen') {
        throw err;
    }

    switch (err.code) {
        case 'EACCES':
            console.error(`${protocol} port ${port} requires elevated privileges`);
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(`${protocol} port ${port} is already in use`);
            process.exit(1);
            break;

        default:
            throw err;
    }
}

function listening(secure: boolean) {
    let port = secure ? httpsPort : httpPort;
    let protocol = secure ? 'HTTPS' : 'HTTP';

    console.log(`${protocol} server listening on port ${port}`);
}
