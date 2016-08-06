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

/// <reference path="../../../node_modules/twitchr-plugin-api/index.ts" />

import * as debug from 'debug';
import * as pluginApi from 'twitchr-plugin-api';
import {Client, IMessage} from 'irc';
import {resolve} from 'app-root-path';
import {sync} from 'glob';

let logIrc: debug.Debugger = debug('twitchr:irc');
let logPlugin: debug.Debugger = debug('twitchr:plugin');

class Plugin {
    constructor(private meta: Object, private plugin: pluginApi.Plugin) { }

    public getMeta(): Object {
        return this.meta;
    }

    public getPlugin(): pluginApi.Plugin {
        return this.plugin;
    }
}

interface HookCollection {
    onActionHooks?: Array<pluginApi.PluginOnAction>;
    onJoinHooks?: Array<pluginApi.PluginOnJoin>;
    onMessageHooks?: Array<pluginApi.PluginOnMessage>;
    onNamesHooks?: Array<pluginApi.PluginOnNames>;
    onPartHooks?: Array<pluginApi.PluginOnPart>;
}

export let plugins: Array<Plugin> = Array<Plugin>();
sync('./twitchr-*/', {
    cwd: resolve('./dist/plugins'),
}).forEach((dir: string) => {
    try {
        let meta: Object = require(resolve(`./dist/plugins/${dir}/package.json`));
        let plugin: pluginApi.Plugin = require(resolve(`./dist/plugins/${dir}/index.js`));

        plugins.push(new Plugin(meta, plugin));
    } catch (err) {
        logPlugin(`Skipped invalid plugin ${dir}`);
    }
});

let hookCollection: HookCollection = {};
plugins.forEach((plugin: Plugin) => {
    let hooks: pluginApi.PluginEventListener = plugin.getPlugin().hooks;

    if (hooks.onAction) {
        if (!hookCollection.onActionHooks) {
            hookCollection.onActionHooks = Array<pluginApi.PluginOnAction>();
        }
        hookCollection.onActionHooks.push(hooks.onAction);
    }

    if (hooks.onJoin) {
        if (!hookCollection.onJoinHooks) {
            hookCollection.onJoinHooks = Array<pluginApi.PluginOnJoin>();
        }
        hookCollection.onJoinHooks.push(hooks.onJoin);
    }

    if (hooks.onMessage) {
        if (!hookCollection.onMessageHooks) {
            hookCollection.onMessageHooks = Array<pluginApi.PluginOnMessage>();
        }
        hookCollection.onMessageHooks.push(hooks.onMessage);
    }

    if (hooks.onNames) {
        if (!hookCollection.onNamesHooks) {
            hookCollection.onNamesHooks = Array<pluginApi.PluginOnNames>();
        }
        hookCollection.onNamesHooks.push(hooks.onNames);
    }

    if (hooks.onPart) {
        if (!hookCollection.onPartHooks) {
            hookCollection.onPartHooks = Array<pluginApi.PluginOnPart>();
        }
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

    let clientChannel: string = '#' + username;

    client.addListener('action', (from: string, to: string, text: string, message: IMessage) => {
        if (hookCollection.onActionHooks && from !== username) {
            let result: string[] = Array<string>();

            hookCollection.onActionHooks.forEach((hook: pluginApi.PluginOnAction) => {
                let res: string = hook(from, to, text);
                if (res) {
                    result.push(res);
                }
            });

            if (result.length >= 1) {
                client.say(clientChannel, decide(result));
            }
        }
    });

    client.addListener('join', (channel: string, nick: string, message: IMessage) => {
        if (hookCollection.onJoinHooks && nick !== username) {
            let result: string[] = Array<string>();

            hookCollection.onJoinHooks.forEach((hook: pluginApi.PluginOnJoin) => {
                let res: string = hook(nick);
                if (res) {
                    result.push(res);
                }
            });

            if (result.length >= 1) {
                client.say(clientChannel, decide(result));
            }
        }
    });

    client.addListener('message', (nick: string, to: string, text: string, message: IMessage) => {
        if (hookCollection.onMessageHooks && nick !== username) {
            let result: string[] = Array<string>();

            hookCollection.onMessageHooks.forEach((hook: pluginApi.PluginOnMessage) => {
                let res: string = hook(nick, to, text);
                if (res) {
                    result.push(res);
                }
            });

            if (result.length >= 1) {
                client.say(clientChannel, decide(result));
            }
        }
    });

    client.addListener('names', (channel: string, nicks: string[]) => {
        if (hookCollection.onNamesHooks) {
            let result: string[] = Array<string>();

            hookCollection.onNamesHooks.forEach((hook: pluginApi.PluginOnNames) => {
                let res: string = hook(nicks);
                if (res) {
                    result.push(res);
                }
            });

            if (result.length >= 1) {
                client.say(clientChannel, decide(result));
            }
        }
    });

    client.addListener('part', (channel: string, nick: string, reason: string, message: IMessage) => {
        if (hookCollection.onPartHooks && nick !== username) {
            let result: string[] = Array<string>();

            hookCollection.onPartHooks.forEach((hook: pluginApi.PluginOnPart) => {
                let res: string = hook(nick, reason);
                if (res) {
                    result.push(res);
                }
            });

            if (result.length >= 1) {
                client.say(clientChannel, decide(result));
            }
        }
    });

    client.addListener('error', (message: IMessage) => {
        console.error(`Error: ${message}`);
    });

    client.connect(0, () => {
        client.send('CAP', 'REQ', 'twitch.tv/membership');

        client.join(clientChannel, () => {
            client.say(clientChannel, 'Chat moderation is running!');
            logIrc('Chat moderation is running');
        });
    });

    return client;
}

/**
 * Decides which action to execute given a set of possible actions.
 * @param {string[]} result
 * @returns {string}
 */
function decide(result: string[]): string {
    if (result.length === 1) {
        return result[0];
    } else {
        // todo: implement decision mechanics
        return result[0];
    }
}
