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

import * as debug from 'debug';
import * as express from 'express';
import * as request from 'request';
import {IncomingMessage} from 'http';
import {initialize} from '../plugin/init';
import {requireAuth} from '../util/misc';

let logIrc: debug.Debugger = debug('twitchr:irc');
let router: express.Router = express.Router();

router.get('/', requireAuth, (req: express.Request, res: express.Response) => {
    let token: string = req.session.oauth.access_token;

    request.get({
        headers: {
            'Accept': 'application/vnd.twitchtv.v3+json',
            'Authorization': 'OAuth ' + token,
        },
        url: 'https://api.twitch.tv/kraken',
    }, (error: any, response: IncomingMessage, body: any) => {
        let version: string = response.headers['x-api-version'];

        if (!error && response.statusCode === 200 && version === '3') {
            logIrc('Twitch API request successful');
            let nick: string = JSON.parse(body).token.user_name;

            if (nick) {
                // TODO store client in session
                initialize(nick.toLowerCase(), token);
                logIrc('Twitch IRC client initialized');
                let url: string = req.session.originalUrl;

                if (url) {
                    req.session.originalUrl = undefined;
                    res.redirect(url);
                } else {
                    res.redirect('/');
                }
            } else {
                console.error('Twitch API rejected invalid OAuth token');
                req.session.oauth = undefined;
                res.redirect('/login');
            }
        } else {
            if (error) {
                console.error(`Twitch API request failed with error: ${error}`);
            } else if (response.statusCode !== 200) {
                console.error(`Twitch API request failed with status code: ${response.statusCode}`);
            } else {
                console.error(`Twitch API request failed with API version: v${version}`);
            }

            setTimeout(function(): void {
                res.redirect('/api/irc');
            }, 2000);
        }
    });
});

export default router;
