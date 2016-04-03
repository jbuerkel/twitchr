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

'use strict';

import * as express from 'express';
import * as request from 'request';
import {IncomingMessage} from 'http';
import {randomBytes} from 'crypto';
import {rejectAuth} from '../util/misc';

let router = express.Router();

router.get('/', rejectAuth, (req: express.Request, res: express.Response) => {
    randomBytes(32, (err: Error, buf: Buffer) => {
        if (!err) {
            let state = buf.toString('hex');
            req.session.oauthState = state;

            res.redirect(
                'https://api.twitch.tv/kraken/oauth2/authorize' +
                '?api_version=3' +
                '&client_id=' + process.env.CLIENT_ID +
                '&force_verify=' + (process.env.FORCE_VERIFY || true) +
                '&redirect_uri=' + process.env.REDIRECT_URI +
                '&response_type=code' +
                '&scope=chat_login' +
                '&state=' + state
            );
        } else {
            // TODO handle error
        }
    });
});

router.get('/callback', rejectAuth, (req: express.Request, res: express.Response) => {
    let state = req.session.oauthState;

    if (req.query.state && req.query.state === state) {
        request.post({
            form: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.REDIRECT_URI,
                state: state
            },
            headers: {
                'Accept': 'application/vnd.twitchtv.v3+json'
            },
            url: 'https://api.twitch.tv/kraken/oauth2/token'
        }, (error: any, response: IncomingMessage, body: any) => {
            if (!error && response.statusCode === 200) {
                req.session.oauth = JSON.parse(body);

                req.session.oauthState = undefined;
                res.redirect('/api/irc');
            } else {
                // TODO handle error
            }
        });
    } else {
        res.redirect('/login');
    }
});

export default router;