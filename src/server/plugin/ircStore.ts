import {IrcClient} from './ircClient';

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
