'use strict';

import * as express from 'express';
import {resolve} from 'app-root-path';

let router = express.Router();

router.get('/login', (req: express.Request, res: express.Response) => {
    if (!req.session.oauth) {
        // TODO load login page
    } else {
        res.redirect('/');
    }
});

router.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(resolve('./dist/client/index.html'));
});

export default router;
