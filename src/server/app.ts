'use strict';

import * as express from 'express';
import * as logger from 'morgan';
import {join} from 'path';
import {loadJsonSync} from './util/json';

import core from './core/router';
import oauth from './oauth/router';

let app = express();
let paths = loadJsonSync(join(__dirname, '../../paths.conf.json'));

app.use(logger('dev'));
app.use(express.static(join(__dirname, '../..', paths.dist.client)));

app.use('/api/oauth2', oauth);

app.use(core);

export default app;
