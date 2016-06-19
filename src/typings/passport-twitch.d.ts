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

declare module 'passport-twitch' {
    import * as passport from 'passport';
    import {Request} from 'express';

    module passportTwitch {
        export class Strategy implements passport.Strategy {
            constructor(options: Options, verify: Verify | VerifyReq);
            authenticate(req: Request, options?: Object): void;
        }

        interface Options {
            /**
             * @default 'https://api.twitch.tv/kraken/oauth2/authorize'
             */
            authorizationURL?: string;

            callbackURL: string;

            clientID: string;

            clientSecret: string;

            /**
             * @default 'https://api.twitch.tv/kraken/oauth2/token'
             */
            tokenURL?: string;

            /**
             * @default false
             */
            passReqToCallback?: boolean;

            /**
             * @default ''
             */
            scope?: string;

            /**
             * @default false
             */
            state?: boolean;
        }

        interface Verify {
            (accessToken: string, refreshToken: string, profile: any, done: Function): void;
        }

        interface VerifyReq {
            (req: Request, accessToken: string, refreshToken: string, profile: any, done: Function): void;
        }
    }

    export = passportTwitch;
}
