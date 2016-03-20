'use strict';

import * as express from 'express';
import {rejectAuth} from '../util/misc';
import {resolve} from 'app-root-path';

let router = express.Router();

router.get('/login', rejectAuth, (req: express.Request, res: express.Response) => {
    res.sendFile(resolve('./dist/client/index.html'));
});

router.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(resolve('./dist/client/index.html'));
});

export default router;
