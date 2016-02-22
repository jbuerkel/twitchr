'use strict';

import * as express from 'express';
import {join} from 'path';
import {loadJsonSync} from '../util/json';

let router = express.Router();
let conf = loadJsonSync(join(__dirname, './oauth.conf.json'));

router.get('/authorize', (req: express.Request, res: express.Response) => {
    // TODO add twitch api version header
    // TODO generate oauth2 state token
    res.redirect(`
        https://api.twitch.tv/kraken/oauth2/authorize
            ?response_type=code
            &client_id=${conf.clientId}
            &redirect_uri=${conf.redirectUri}
            &scope=chat_login
            &state=[your provided unique token]
            &force_verify=${conf.forceVerify}
    `);
});

router.get('/token', (req: express.Request, res: express.Response) => {
    // TODO implement http post request
});

export default router;
