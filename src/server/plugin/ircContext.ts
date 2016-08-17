import {Client} from 'irc';

export class IrcContext {
    private args: Object;
    private channel: string;

    constructor(event: string, private name: string, private client: Client, args: any[]) {
        this.channel = '#' + name;

        switch (event) {
            case 'action':
                this.args = { user: args[0], text: args[2] };
                break;

            case 'join':
                this.args = { user: args[1] };
                break;

            case 'message':
                this.args = { user: args[0], text: args[2] };
                break;

            case 'names':
                this.args = { users: args[1] };
                break;

            case 'part':
                this.args = { user: args[1] };
                break;
        }
    }

    ban(user: string): void {
        this.client.say(this.channel, `/ban ${user}`);
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
