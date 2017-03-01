/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { IrcClient } from './ircClient';

interface IrcStore {
    [name: string]: IrcClient;
}

const store: IrcStore = {};

export function deleteClient(name: string): void {
    const client: IrcClient = store[name];
    if (client) {
        client.stop(() => delete store[name]);
    }
}

export function getClient(name: string): IrcClient {
    return store[name];
}

export function putClient(name: string, token: string): IrcClient {
    if (!store[name]) {
        const client: IrcClient = new IrcClient(name, token);
        store[name] = client.init();
    }

    return store[name];
}
