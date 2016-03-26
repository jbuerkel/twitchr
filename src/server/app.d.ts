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

declare module Express {
    import {Client} from 'irc';

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

declare module 'app-root-path' {
    module appRootPath {
        export let path: string;

        export function require(pathToModule: string): Object;

        export function resolve(pathToModule: string): string;

        export function setPath(explicitlySetPath: string): void;

        export function toString(): string;
    }

    export = appRootPath;
}

declare module 'dotenv' {
    module dotenv {
        export interface Options {
            /**
             * (Default: 'utf8')
             */
            encoding?: string;

            /**
             * (Default: '.env')
             */
            path?: string;

            /**
             * (Default: false)
             */
            silent?: boolean;
        }

        export function config(options?: Options): boolean;

        export function load(options?: Options): boolean;

        export function parse(src: string | Buffer): Object;
    }

    export = dotenv;
}

declare module 'dotenv-safe' {
    import * as dotenv from 'dotenv';

    module dotenvSafe {
        export interface Options extends dotenv.Options {
            /**
             * (Default: '.env.example')
             */
            sample?: string;
        }

        export function config(options?: Options): boolean;

        export function load(options?: Options): boolean;

        export function parse(src: string | Buffer): Object;
    }

    export = dotenvSafe;
}
