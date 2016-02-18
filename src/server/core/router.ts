'use strict';

import * as express from 'express';
import {join} from 'path';
import {loadJsonSync} from '../util/json';

let router = express.Router();
let paths = loadJsonSync('../../../paths.conf');

router.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(join(__dirname, '../../..', paths.dist.client, 'index.html'));
});

export default router;
