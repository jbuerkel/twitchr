#!/usr/bin/env node

/*!
    twitchr - A twitch bot providing IRC based assistance
    Copyright (C) 2016  Jonas Bürkel
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import {readFileSync} from 'fs';
import {resolve} from 'app-root-path';
import app from '../app';

let httpApp: express.Express = express();
let httpPort: number = 8080;
let httpsPort: number = process.env.PORT || 8443;

let options: https.ServerOptions = {
    cert: readFileSync(resolve('./cert/cert.pem')),
    key: readFileSync(resolve('./cert/key.pem')),
};

app.set('port', httpsPort);
httpApp.set('port', httpPort);
httpApp.get('*', (req: express.Request, res: express.Response) => {
    res.redirect(301, `https://${req.hostname}:${httpsPort + req.url}`);
});

let httpServer: http.Server = http.createServer(httpApp);
let httpsServer: https.Server = https.createServer(options, app);
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

function error(err: any, secure: boolean): void {
    let port: number = secure ? httpsPort : httpPort;
    let protocol: string = secure ? 'HTTPS' : 'HTTP';

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

function listening(secure: boolean): void {
    let port: number = secure ? httpsPort : httpPort;
    let protocol: string = secure ? 'HTTPS' : 'HTTP';

    console.log(`${protocol} server listening on port ${port}`);
}
