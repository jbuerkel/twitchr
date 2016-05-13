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
import {Client, IMessage} from 'irc';
import {resolve} from 'app-root-path';
import {sync} from 'glob';

let logIrc: debug.Debugger = debug('twitchr:irc');
let logPlugin: debug.Debugger = debug('twitchr:plugin');

export interface PluginOnAction {
    (from: string, to: string, text: string): void;
}

export interface PluginOnJoin {
    (nick: string): void;
}

export interface PluginOnMessage {
    (nick: string, to: string, text: string): void;
}

export interface PluginOnNames {
    (nicks: string[]): void;
}

export interface PluginOnPart {
    (nick: string, reason: string): void;
}

export interface PluginEventListener {
    onAction?: PluginOnAction;
    onJoin?: PluginOnJoin;
    onMessage?: PluginOnMessage;
    onNames?: PluginOnNames;
    onPart?: PluginOnPart;
}

export interface PluginInterface<T extends Object> {
    config: (options: T) => boolean;
    hooks: PluginEventListener;
    options: T;
}

class Plugin {
    constructor(private meta: Object, private plugin: PluginInterface<Object>) { }

    public getMeta(): Object {
        return this.meta;
    }

    public getPlugin(): PluginInterface<Object> {
        return this.plugin;
    }
}

interface HookCollection {
    onActionHooks?: Array<PluginOnAction>;
    onJoinHooks?: Array<PluginOnJoin>;
    onMessageHooks?: Array<PluginOnMessage>;
    onNamesHooks?: Array<PluginOnNames>;
    onPartHooks?: Array<PluginOnPart>;
}

export let plugins: Array<Plugin> = Array<Plugin>();
sync(resolve('./plugins/twitchr-*/')).forEach((dir: string) => {
    let json: Object = require(resolve(`./plugins/${dir}/package.json`));
    let ts: PluginInterface<Object> = require(resolve(`./plugins/${dir}/index.ts`));

    if (json && ts) {
        plugins.push(new Plugin(json, ts));
    } else {
        logPlugin(`Skipped invalid plugin ${dir}`);
    }
});

let hookCollection: HookCollection = {};
plugins.forEach((plugin: Plugin) => {
    let hooks: PluginEventListener = plugin.getPlugin().hooks;

    if (hooks.onAction) {
        hookCollection.onActionHooks.push(hooks.onAction);
    }

    if (hooks.onJoin) {
        hookCollection.onJoinHooks.push(hooks.onJoin);
    }

    if (hooks.onMessage) {
        hookCollection.onMessageHooks.push(hooks.onMessage);
    }

    if (hooks.onNames) {
        hookCollection.onNamesHooks.push(hooks.onNames);
    }

    if (hooks.onPart) {
        hookCollection.onPartHooks.push(hooks.onPart);
    }
});

/**
 * Initializes a new IRC client given a username and password.
 * @param {string} username
 * @param {string} password
 * @returns {Client}
 */
export function initialize(username: string, password: string): Client {
    let client: Client = new Client('irc.chat.twitch.tv', username, {
        autoConnect: false,
        floodProtection: true,
        floodProtectionDelay: 333,
        messageSplit: 1000,
        password: 'oauth:' + password,
        port: 80,
        realName: username,
        userName: username,
    });

    // TODO pass username to hooks

    client.addListener('action', (from: string, to: string, text: string, message: IMessage) => {
        if (hookCollection.onActionHooks && from !== username) {
            hookCollection.onActionHooks.forEach((hook: PluginOnAction) => {
                hook(from, to, text);
            });
        }
    });

    client.addListener('join', (channel: string, nick: string, message: IMessage) => {
        if (hookCollection.onJoinHooks && nick !== username) {
            hookCollection.onJoinHooks.forEach((hook: PluginOnJoin) => {
                hook(nick);
            });
        }
    });

    client.addListener('message', (nick: string, to: string, text: string, message: IMessage) => {
        if (hookCollection.onMessageHooks && nick !== username) {
            hookCollection.onMessageHooks.forEach((hook: PluginOnMessage) => {
                hook(nick, to, text);
            });
        }
    });

    client.addListener('names', (channel: string, nicks: string[]) => {
        if (hookCollection.onNamesHooks) {
            hookCollection.onNamesHooks.forEach((hook: PluginOnNames) => {
                hook(nicks);
            });
        }
    });

    client.addListener('part', (channel: string, nick: string, reason: string, message: IMessage) => {
        if (hookCollection.onPartHooks && nick !== username) {
            hookCollection.onPartHooks.forEach((hook: PluginOnPart) => {
                hook(nick, reason);
            });
        }
    });

    client.addListener('error', (message: IMessage) => {
        console.error(`Error: ${message}`);
    });

    client.connect(0, () => {
        client.send('CAP', 'REQ', 'twitch.tv/membership');
        let channel: string = '#' + username;

        client.join(channel, () => {
            client.say(channel, 'Chat moderation is running!');
            logIrc('Chat moderation is running');
        });
    });

    return client;
}
