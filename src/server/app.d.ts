declare module Express {
    export interface Session {
        oauth?: Oauth2Token;
        originalUrl?: string;
    }

    interface Oauth2Token {
        access_token: string;
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
