'use strict';

import * as express from 'express';

let router = express.Router();

router.get('/authorize', (req: express.Request, res: express.Response) => {
    // TODO generate oauth2 state token
    res.redirect(`
        https://api.twitch.tv/kraken/oauth2/authorize
            ?api_version=3
            &client_id=${process.env.CLIENT_ID}
            &force_verify=${process.env.FORCE_VERIFY || true}
            &redirect_uri=${process.env.REDIRECT_URI}
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
