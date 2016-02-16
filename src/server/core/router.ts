/* jshint node: true */
'use strict';

import * as express from 'express';
import * as path from 'path';

var router = express.Router();

router.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
});

export = router;
