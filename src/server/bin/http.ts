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

import * as debug from 'debug';
import {createServer, Server} from 'http';
import app from '../app';

let debug: debug.Debugger = debug('twitchr:server');

let port: number = process.env.PORT || 8080;
app.set('port', port);
let server: Server = createServer(app);

server.listen(port);

server.on('error', (err: any) => {
    if (err.syscall !== 'listen') {
        throw err;
    }

    switch (err.code) {
        case 'EACCES':
            console.error(`HTTP port ${port} requires elevated privileges`);
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(`HTTP port ${port} is already in use`);
            process.exit(1);
            break;

        default:
            throw err;
    }
});

server.on('listening', () => {
    let addr: any = server.address();
    debug(`HTTP server listening on port ${addr.port}`);
});
