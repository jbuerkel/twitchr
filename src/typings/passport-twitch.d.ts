/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

declare module 'passport-twitch' {
    import * as passport from 'passport';
    import { Request }   from 'express';

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
