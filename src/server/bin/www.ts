/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as debug       from 'debug';
import * as http        from 'http';
import * as https       from 'https';
import { readFileSync } from 'fs';
import { resolve }      from 'app-root-path';

import app from '../app';

const debugServer: debug.IDebugger = debug('twitchr:server');
const port: number = 3000;
app.set('port', port);

let server: http.Server | https.Server;

if (process.env.USE_TLS === 'true') {
    const options: https.ServerOptions = {
        cert: readFileSync(resolve('./cert/cert.pem')),
        key: readFileSync(resolve('./cert/key.pem')),
    };

    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: any): void {
    const protocol: string = process.env.USE_TLS === 'true' ? 'HTTPS' : 'HTTP';

    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`${protocol} port ${port} requires elevated privileges`);
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(`${protocol} port ${port} is already in use`);
            process.exit(1);
            break;

        default:
            throw error;
    }
}

function onListening(): void {
    const protocol: string = process.env.USE_TLS === 'true' ? 'HTTPS' : 'HTTP';
    debugServer(`${protocol} server listening on port ${port}`);
}
