/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as api    from 'twitchr-plugin-api';
import * as debug  from 'debug';
import { resolve } from 'app-root-path';

const debugPlugin: debug.IDebugger = debug('twitchr:plugin');

export class Plugin {
    constructor(private meta: Object, private plugin: api.Plugin) { }

    getMeta(): Object {
        return this.meta;
    }

    getPlugin(): api.Plugin {
        return this.plugin;
    }
}

const pkg: any = require(resolve('./package.json'));
const plugins: Array<Plugin> = [];

Object.keys(pkg.dependencies)
    .filter((k: string) => k.indexOf('twitchr-') === 0 && k !== 'twitchr-plugin-api')
    .forEach(loadPlugin);

if (plugins.length < 1) {
    console.warn('No plugins were found');
}

export function getPlugins(): Array<Plugin> {
    return plugins;
}

function loadPlugin(name: string): void {
    try {
        const meta: Object = require(resolve(`./node_modules/${name}/package.json`));
        const plugin: api.Plugin = require(name);

        plugins.push(new Plugin(meta, plugin));
    } catch (err) {
        debugPlugin(`Skipping invalid plugin ${name}`);
    }
}
