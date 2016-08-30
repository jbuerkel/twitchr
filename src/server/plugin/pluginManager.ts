/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/// <reference path="../../../node_modules/twitchr-plugin-api/index.ts" />

import * as api from 'twitchr-plugin-api';
import * as debug from 'debug';
import * as glob from 'glob';
import {resolve} from 'app-root-path';

const debugPlugin: debug.Debugger = debug('twitchr:plugin');
let plugins: Array<Plugin> = [];

initialize((err: any) => {
    if (err) {
        console.error(err);
    }
});

export class Plugin {
    constructor(private meta: Object, private plugin: api.Plugin) { }

    getMeta(): Object {
        return this.meta;
    }

    getPlugin(): api.Plugin {
        return this.plugin;
    }
}

export function getPlugins(): Array<Plugin> {
    return plugins;
}

export function initialize(done: (err: any) => void): void {
    glob('./twitchr-*/', { cwd: resolve('./dist/plugins') }, (err: any, matches: string[]) => {
        if (err) {
            done(err);
        } else {
            plugins = [];
            matches.forEach(loadPlugin);
            if (plugins.length < 1) {
                console.warn('No plugins were found');
            }

            done(null);
        }
    });
}

function loadPlugin(name: string): void {
    try {
        const meta: Object = require(resolve(`./dist/plugins/${name}/package.json`));
        const plugin: api.Plugin = require(resolve(`./dist/plugins/${name}/index.js`));

        plugins.push(new Plugin(meta, plugin));
    } catch (err) {
        debugPlugin(`Skipping invalid plugin ${name}`);
    }
}
