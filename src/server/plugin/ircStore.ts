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

let store: IrcStore = {};

export function deleteClient(name: string): void {
    let client: IrcClient = store[name];
    if (client) {
        client.stop(() => delete store[name]);
    }
}

export function getClient(name: string): IrcClient {
    return store[name];
}

export function putClient(name: string, client: IrcClient): void {
    store[name] = client;
}
