/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as api   from 'twitchr-plugin-api';
import { Plugin } from './pluginManager';

export class HookCollection {
    private joinHooks: Array<api.PluginHook<api.IrcJoin>> = [];
    private messageHooks: Array<api.PluginHook<api.IrcMessage>> = [];
    private namesHooks: Array<api.PluginHook<api.IrcNames>> = [];
    private partHooks: Array<api.PluginHook<api.IrcPart>> = [];

    constructor(plugins: Array<Plugin>) {
        for (let i: number = 0; i < plugins.length; i++) {
            const hooks: api.PluginEventListener = plugins[i].getPlugin().hooks;

            if (hooks.onJoin) {
                this.joinHooks.push(hooks.onJoin);
            }

            if (hooks.onMessage) {
                this.messageHooks.push(hooks.onMessage);
            }

            if (hooks.onNames) {
                this.namesHooks.push(hooks.onNames);
            }

            if (hooks.onPart) {
                this.partHooks.push(hooks.onPart);
            }
        }
    }

    getJoinHooks(): Array<api.PluginHook<api.IrcJoin>> {
        return this.joinHooks;
    }

    getMessageHooks(): Array<api.PluginHook<api.IrcMessage>> {
        return this.messageHooks;
    }

    getNamesHooks(): Array<api.PluginHook<api.IrcNames>> {
        return this.namesHooks;
    }

    getPartHooks(): Array<api.PluginHook<api.IrcPart>> {
        return this.partHooks;
    }
}
