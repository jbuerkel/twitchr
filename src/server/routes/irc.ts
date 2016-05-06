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
import {Client} from 'irc';
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
        let version: number = response.headers['x-api-version'];

        if (!error && response.statusCode === 200 && version === 3) {
            let nick: string = JSON.parse(body).token.user_name.toLowerCase();

            let client: Client = new Client('irc.twitch.tv', nick, {
                channels: [],
                floodProtection: true,
                floodProtectionDelay: 333,
                password: 'oauth:' + token,
                realName: 'Twitch IRC bot',
                sasl: true,
                userName: 'twitchr',
            });

            initialize(client);
            req.session.ircClient = client;
            let url: string = req.session.originalUrl;

            if (url) {
                req.session.originalUrl = undefined;
                res.redirect(url);
            } else {
                res.redirect('/');
            }
        } else {
            if (error) {
                logIrc(`Twitch API request failed with error: ${error}`);
            } else if (response.statusCode !== 200) {
                logIrc(`Twitch API request failed with status code: ${response.statusCode}`);
            } else {
                logIrc(`Twitch API request failed with API version: v${version}`);
            }

            res.redirect('/');
        }
    });
});

export default router;
