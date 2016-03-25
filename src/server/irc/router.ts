'use strict';

import * as express from 'express';
import * as request from 'request';
import {Client} from 'irc';
import {IncomingMessage} from 'http';
import {requireAuth} from '../util/misc';

let router = express.Router();

router.get('/', requireAuth, (req: express.Request, res: express.Response) => {
    let token = req.session.oauth.access_token;

    request.get({
        headers: {
            'Accept': 'application/vnd.twitchtv.v3+json',
            'Authorization': 'OAuth ' + token
        },
        url: 'https://api.twitch.tv/kraken'
    }, (error: any, response: IncomingMessage, body: any) => {
        let version = response.headers['x-api-version'];

        if (!error && response.statusCode === 200 && version === 3) {
            let nick = JSON.parse(body).token.user_name.toLowerCase();

            req.session.ircClient = new Client('irc.twitch.tv', nick, {
                autoConnect: false,
                password: 'oauth:' + token,
                realName: 'Twitch IRC bot',
                sasl: true,
                userName: 'twitchr'
            });

            // TODO initialize plugins
            let url = req.session.originalUrl;

            if (url) {
                req.session.originalUrl = undefined;
                res.redirect(url);
            } else {
                res.redirect('/');
            }
        } else {
            // TODO handle error
        }
    });
});

export default router;
