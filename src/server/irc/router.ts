'use strict';

import * as express from 'express';
import {requireAuth} from '../util/misc';

let router = express.Router();

router.get('/', requireAuth, (req: express.Request, res: express.Response) => {
    // TODO connect to twitch chat
});

export default router;
