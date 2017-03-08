/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { handlers } from 'irc';

declare module 'irc' {
    export interface Client {
        part(
            channel: string,
            message?: string | handlers.IPartChannel,
            callback?: handlers.IPartChannel
        ): void;

        disconnect(
            message?: string | handlers.IRaw,
            callback?: handlers.IRaw
        ): void;
    }
}

declare global {
    module Express {
        export interface Session {
            returnTo?: string;
        }
    }
}
