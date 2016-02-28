'use strict';

import * as express from 'express';
import {join} from 'path';
import {loadJson} from '../util/misc';

let router = express.Router();
let conf = loadJson(join(__dirname, './oauth.conf.json'));

router.get('/authorize', (req: express.Request, res: express.Response) => {
    // TODO generate oauth2 state token
    res.redirect(`
        https://api.twitch.tv/kraken/oauth2/authorize
            ?api_version=3
            &client_id=${conf.clientId}
            &force_verify=${conf.forceVerify}
            &redirect_uri=${conf.redirectUri}
            &response_type=code
            &scope=chat_login
            &state=[your provided unique token]
    `);
});

router.get('/token', (req: express.Request, res: express.Response) => {
    // TODO add twitch api version header
    // TODO implement http post request
});

export default router;
