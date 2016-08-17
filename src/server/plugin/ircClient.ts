import * as api from 'twitchr-plugin-api';
import * as debug from 'debug';
import {Client, IMessage} from 'irc';
import {getPlugins, Plugin} from './pluginManager';
import {HookCollection} from './hookCollection';
import {IrcContext} from './ircContext';

const debugIrc: debug.Debugger = debug('twitchr:irc');

export class IrcClient {
    private client: Client;
    private plugins: Array<Plugin>;

    constructor(private name: string, token: string) {
        this.client = new Client('irc.chat.twitch.tv', name, {
            autoConnect: false,
            floodProtection: true,
            floodProtectionDelay: 333,
            messageSplit: 1000,
            password: 'oauth:' + token,
            port: 80,
            realName: name,
            userName: name,
        });

        this.client.addListener('error', (message: IMessage) => {
            debugIrc(`${name} error: ${message}`);
        });
    }

    config(): IrcClient {
        this.plugins = getPlugins();
        const hooks: HookCollection = new HookCollection(this.plugins);

        this.client.addListener('action', (...args: any[]) => {
            const context: IrcContext = new IrcContext('action', this.name, this.client, args);
            hooks.getActionHooks().forEach((hook: api.PluginOnAction) => hook(context));
        });

        this.client.addListener('join', (...args: any[]) => {
            const context: IrcContext = new IrcContext('join', this.name, this.client, args);
            hooks.getJoinHooks().forEach((hook: api.PluginOnJoin) => hook(context));
        });

        this.client.addListener('message', (...args: any[]) => {
            const context: IrcContext = new IrcContext('message', this.name, this.client, args);
            hooks.getMessageHooks().forEach((hook: api.PluginOnMessage) => hook(context));
        });

        this.client.addListener('names', (...args: any[]) => {
            const context: IrcContext = new IrcContext('names', this.name, this.client, args);
            hooks.getNamesHooks().forEach((hook: api.PluginOnNames) => hook(context));
        });

        this.client.addListener('part', (...args: any[]) => {
            const context: IrcContext = new IrcContext('part', this.name, this.client, args);
            hooks.getPartHooks().forEach((hook: api.PluginOnPart) => hook(context));
        });

        return this;
    }

    start(done: () => void): void {
        const channel: string = '#' + this.name;

        this.client.connect(() => {
            this.client.send('CAP', 'REQ', 'twitch.tv/membership');

            this.client.join(channel, () => {
                this.client.say(channel, 'Chat moderation is started');
                debugIrc(`${this.name} started successfully`);

                done();
            });
        });
    }

    stop(done: () => void): void {
        const channel: string = '#' + this.name;

        this.client.say(channel, 'Chat moderation is stopped');
        this.client.part(channel, () => {
            this.client.disconnect(() => {
                debugIrc(`${this.name} stopped successfully`);

                done();
            });
        });
    }
}
