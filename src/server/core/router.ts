'use strict';

import * as express from 'express';
import {join} from 'path';

let router = express.Router();

router.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(join(__dirname, '../../build/index.html')); // TODO
});

export default router;
