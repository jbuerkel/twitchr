/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as api   from 'twitchr-plugin-api';
import { Client } from 'irc';

export class IrcContext<T extends api.IrcEvent> implements api.IrcContext<T> {
    private channel: string;

    constructor(private name: string, private client: Client, private args: T) {
        this.channel = '#' + name;
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
        this.client.say(this.channel, `/timeout ${user} ${seconds || 600}`);
    }

    ban(user: string): void {
        this.client.say(this.channel, `/ban ${user}`);
    }

    unban(user: string): void {
        this.client.say(this.channel, `/unban ${user}`);
    }

    slow(seconds: number): void {
        this.client.say(this.channel, `/slow ${seconds}`);
    }

    slowoff(): void {
        this.client.say(this.channel, `/slowoff`);
    }

    subscribers(): void {
        this.client.say(this.channel, `/subscribers`);
    }

    subscribersoff(): void {
        this.client.say(this.channel, `/subscribersoff`);
    }

    clear(): void {
        this.client.say(this.channel, `/clear`);
    }

    r9kbeta(): void {
        this.client.say(this.channel, `/r9kbeta`);
    }

    r9kbetaoff(): void {
        this.client.say(this.channel, `/r9kbetaoff`);
    }

    emoteonly(): void {
        this.client.say(this.channel, `/emoteonly`);
    }

    emoteonlyoff(): void {
        this.client.say(this.channel, `/emoteonlyoff`);
    }
}
