'use strict';

import * as express from 'express';
import {loadJsonRoot, rootJoin} from '../util/misc';

let router = express.Router();
let paths = loadJsonRoot('./paths.conf.json');

router.get('/login', (req: express.Request, res: express.Response) => {
    if (!req.session.oauth) {
        // TODO load login page
    } else {
        res.redirect('/');
    }
});

router.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(rootJoin(paths.dist.client, 'index.html'));
});

export default router;
