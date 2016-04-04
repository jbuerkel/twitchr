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

'use strict';

import {Client} from 'irc';
import {resolve} from 'app-root-path';
import {sync} from 'glob';

class Plugin {
    constructor(private meta: Object, private plugin: PluginInterface<Object>) { }

    public getMeta(): Object {
        return this.meta;
    }

    public getPlugin(): PluginInterface<Object> {
        return this.plugin;
    }
}

let plugins: Array<Plugin> = Array<Plugin>();
sync(resolve('./plugins/twitchr-*/')).forEach((dir: string) => {
    plugins.push(new Plugin(
        require(resolve('./plugins/' + dir + '/package.json')),
        require(resolve('./plugins/' + dir + '/index.ts'))
    ));
});

export interface PluginInterface<T extends Object> {
    config: (options: T) => boolean;
    hooks: PluginEventListener;
    options: T;
}

export interface PluginEventListener {
    onMessage?: () => void;
    /* ... */
}

export function initialize(client: Client): boolean {
    // TODO load plugins

    return true;
}
