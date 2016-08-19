import * as api from 'twitchr-plugin-api';
import {Client} from 'irc';

export class IrcContext<T extends api.IrcEvent> implements api.IrcContext<T> {
    private channel: string;

    constructor(private name: string, private client: Client, private args: T) {
        this.channel = '#' + name;
    }

    ban(user: string): void {
        this.client.say(this.channel, `/ban ${user}`);
    }

    getArgs(): T {
        return this.args;
    }

    getChannel(): string {
        return this.channel;
    }

    getName(): string {
        return this.name;
    }

    send(text: string): void {
        this.client.say(this.channel, text);
    }

    timeout(user: string, seconds?: number): void {
        this.client.say(this.channel, `/timeout ${user} ${seconds ? seconds : 600}`);
    }

    unban(user: string): void {
        this.client.say(this.channel, `/unban ${user}`);
    }
}
