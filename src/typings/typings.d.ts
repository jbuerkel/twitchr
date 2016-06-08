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

import {Client} from 'irc';
import {DefaultOptions} from 'connect-mongo';

declare module 'connect-mongo' {
    interface DefaultOptions {
        /**
         * @default 0
         */
        touchAfter?: number;
    }
}

declare global {
    module Express {
        export interface Session {
            ircClient?: Client;
            oauth?: Oauth2Token;
            oauthState?: string;
            originalUrl?: string;
        }

        interface Oauth2Token {
            access_token: string;
            refresh_token: string;
            scope: string[];
        }
    }
}
